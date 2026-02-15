import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { nanoid } from 'nanoid';

// 获取或创建用户（基于浏览器生成的用户ID）
export async function POST(request: NextRequest) {
  try {
    const { userId, username } = await request.json();
    
    const client = getSupabaseClient();
    
    // 如果提供了 userId，尝试获取现有用户
    if (userId) {
      const { data: existingUser, error } = await client
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (existingUser && !error) {
        return NextResponse.json({ user: existingUser });
      }
    }
    
    // 创建新用户
    const newUsername = username || `用户${nanoid(6)}`;
    const avatars = ['🎨', '📚', '🎵', '✨', '🌟', '💫', '🎭', '🎪', '🎯', '🎲'];
    const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];
    
    const { data: newUser, error: createError } = await client
      .from('users')
      .insert({
        username: newUsername,
        avatar: randomAvatar,
      })
      .select()
      .single();
    
    if (createError) {
      console.error('Create user error:', createError);
      return NextResponse.json({ error: '创建用户失败' }, { status: 500 });
    }
    
    // 创建用户学习统计记录
    await client
      .from('study_stats')
      .insert({
        user_id: newUser.id,
      });
    
    return NextResponse.json({ user: newUser });
  } catch (error) {
    console.error('User API error:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}

// 更新用户信息
export async function PUT(request: NextRequest) {
  try {
    const { userId, username } = await request.json();
    
    if (!userId) {
      return NextResponse.json({ error: '缺少用户ID' }, { status: 400 });
    }
    
    const client = getSupabaseClient();
    
    const { data, error } = await client
      .from('users')
      .update({ username })
      .eq('id', userId)
      .select()
      .single();
    
    if (error) {
      console.error('Update user error:', error);
      return NextResponse.json({ error: '更新失败' }, { status: 500 });
    }
    
    return NextResponse.json({ user: data });
  } catch (error) {
    console.error('User update error:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
