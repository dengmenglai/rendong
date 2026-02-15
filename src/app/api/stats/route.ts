import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

// 获取学习统计
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: '缺少用户ID' }, { status: 400 });
    }
    
    const client = getSupabaseClient();
    
    const { data: stats, error } = await client
      .from('study_stats')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      console.error('Fetch stats error:', error);
      return NextResponse.json({ error: '获取失败' }, { status: 500 });
    }
    
    // 如果没有统计记录，创建一个
    if (!stats) {
      const { data: newStats } = await client
        .from('study_stats')
        .insert({ user_id: parseInt(userId) })
        .select()
        .single();
      
      return NextResponse.json({ stats: newStats });
    }
    
    return NextResponse.json({ stats });
  } catch (error) {
    console.error('Stats GET error:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}

// 更新学习统计
export async function PUT(request: NextRequest) {
  try {
    const { userId, dailyGoal, addSeconds, addArticle, addWords } = await request.json();
    
    if (!userId) {
      return NextResponse.json({ error: '缺少用户ID' }, { status: 400 });
    }
    
    const client = getSupabaseClient();
    
    // 获取当前统计
    const { data: stats } = await client
      .from('study_stats')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    const updateData: Record<string, any> = {};
    
    if (dailyGoal !== undefined) {
      updateData.daily_goal = dailyGoal;
    }
    
    if (addSeconds !== undefined) {
      updateData.today_seconds = (stats?.today_seconds || 0) + addSeconds;
      updateData.week_seconds = (stats?.week_seconds || 0) + addSeconds;
      updateData.month_seconds = (stats?.month_seconds || 0) + addSeconds;
    }
    
    if (addArticle !== undefined) {
      const articlesRead = JSON.parse(stats?.articles_read || '[]');
      if (!articlesRead.includes(addArticle)) {
        articlesRead.push(addArticle);
        updateData.articles_read = JSON.stringify(articlesRead);
      }
    }
    
    if (addWords !== undefined) {
      updateData.words_learned = (stats?.words_learned || 0) + addWords;
    }
    
    if (Object.keys(updateData).length > 0) {
      await client
        .from('study_stats')
        .update(updateData)
        .eq('user_id', userId);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Stats PUT error:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
