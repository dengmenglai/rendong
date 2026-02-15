import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

// 签到
export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();
    
    if (!userId) {
      return NextResponse.json({ error: '缺少用户ID' }, { status: 400 });
    }
    
    const client = getSupabaseClient();
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    
    // 检查今日是否已签到
    const { data: existingCheckIn } = await client
      .from('check_ins')
      .select('*')
      .eq('user_id', userId)
      .eq('check_date', today)
      .single();
    
    if (existingCheckIn) {
      return NextResponse.json({ 
        success: false, 
        message: '今日已签到',
        alreadyChecked: true 
      });
    }
    
    // 获取用户统计数据
    const { data: stats } = await client
      .from('study_stats')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    // 计算连续签到
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    let newStreak = 1;
    if (stats?.last_check_date === yesterdayStr) {
      newStreak = (stats.streak || 0) + 1;
    }
    
    // 添加签到记录
    await client
      .from('check_ins')
      .insert({
        user_id: userId,
        check_date: today,
      });
    
    // 更新用户统计
    await client
      .from('study_stats')
      .update({
        total_days: (stats?.total_days || 0) + 1,
        streak: newStreak,
        last_check_date: today,
      })
      .eq('user_id', userId);
    
    return NextResponse.json({
      success: true,
      streak: newStreak,
      totalDays: (stats?.total_days || 0) + 1,
    });
  } catch (error) {
    console.error('Check-in error:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}

// 获取签到日历
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const year = searchParams.get('year') || new Date().getFullYear().toString();
    const month = searchParams.get('month') || (new Date().getMonth() + 1).toString();
    
    if (!userId) {
      return NextResponse.json({ error: '缺少用户ID' }, { status: 400 });
    }
    
    const client = getSupabaseClient();
    
    // 构建月份范围
    const monthStr = month.padStart(2, '0');
    const startDate = `${year}-${monthStr}-01`;
    const endDate = `${year}-${monthStr}-31`;
    
    const { data: checkIns, error } = await client
      .from('check_ins')
      .select('check_date')
      .eq('user_id', userId)
      .gte('check_date', startDate)
      .lte('check_date', endDate);
    
    if (error) {
      console.error('Fetch check-ins error:', error);
      return NextResponse.json({ error: '获取失败' }, { status: 500 });
    }
    
    return NextResponse.json({
      checkIns: checkIns?.map((c: { check_date: string }) => c.check_date) || [],
    });
  } catch (error) {
    console.error('Check-in GET error:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
