import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { deleteFile } from '@/lib/aliyun-oss';

// 检查是否是管理员
async function checkAdmin(userId: string): Promise<boolean> {
  const client = getSupabaseClient();
  const { data: user } = await client
    .from('users')
    .select('is_admin')
    .eq('id', parseInt(userId))
    .single();
  
  return user?.is_admin === true;
}

// 获取管理统计数据
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId || !(await checkAdmin(userId))) {
      return NextResponse.json({ error: '无权限' }, { status: 403 });
    }
    
    const client = getSupabaseClient();
    
    // 获取统计数据
    const [usersResult, recordingsResult, commentsResult, likesResult] = await Promise.all([
      client.from('users').select('id', { count: 'exact', head: true }),
      client.from('recordings').select('id', { count: 'exact', head: true }),
      client.from('comments').select('id', { count: 'exact', head: true }),
      client.from('likes').select('id', { count: 'exact', head: true }),
    ]);
    
    // 获取所有用户列表
    const { data: users } = await client
      .from('users')
      .select('id, username, avatar, is_admin, created_at')
      .order('created_at', { ascending: false })
      .limit(50);
    
    // 获取所有录音列表
    const { data: recordings } = await client
      .from('recordings')
      .select(`
        id,
        user_id,
        article_title,
        duration,
        likes,
        created_at,
        users ( id, username, avatar )
      `)
      .order('created_at', { ascending: false })
      .limit(50);
    
    return NextResponse.json({
      stats: {
        users: usersResult.count || 0,
        recordings: recordingsResult.count || 0,
        comments: commentsResult.count || 0,
        likes: likesResult.count || 0,
      },
      users,
      recordings,
    });
  } catch (error) {
    console.error('Admin GET error:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}

// 删除用户
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const adminId = searchParams.get('adminId');
    const targetType = searchParams.get('type'); // user | recording | comment
    const targetId = searchParams.get('id');
    
    if (!adminId || !(await checkAdmin(adminId))) {
      return NextResponse.json({ error: '无权限' }, { status: 403 });
    }
    
    if (!targetType || !targetId) {
      return NextResponse.json({ error: '缺少参数' }, { status: 400 });
    }
    
    const client = getSupabaseClient();
    
    if (targetType === 'user') {
      // 不能删除管理员
      const { data: targetUser } = await client
        .from('users')
        .select('is_admin')
        .eq('id', parseInt(targetId))
        .single();
      
      if (targetUser?.is_admin) {
        return NextResponse.json({ error: '不能删除管理员' }, { status: 400 });
      }
      
      // 获取用户的所有录音，删除 OSS 文件
      const { data: userRecordings } = await client
        .from('recordings')
        .select('audio_key')
        .eq('user_id', parseInt(targetId));
      
      for (const rec of userRecordings || []) {
        try {
          await deleteFile(rec.audio_key);
        } catch (e) {
          console.error('Delete OSS file error:', e);
        }
      }
      
      // 删除用户（会级联删除相关数据）
      await client.from('users').delete().eq('id', parseInt(targetId));
      
    } else if (targetType === 'recording') {
      // 获取录音信息
      const { data: recording } = await client
        .from('recordings')
        .select('audio_key')
        .eq('id', parseInt(targetId))
        .single();
      
      if (recording) {
        // 删除 OSS 文件
        try {
          await deleteFile(recording.audio_key);
        } catch (e) {
          console.error('Delete OSS file error:', e);
        }
        
        // 删除数据库记录
        await client.from('recordings').delete().eq('id', parseInt(targetId));
      }
      
    } else if (targetType === 'comment') {
      await client.from('comments').delete().eq('id', parseInt(targetId));
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin DELETE error:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}

// 设置/取消管理员
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { adminId, targetUserId, isAdmin } = body;
    
    if (!adminId || !(await checkAdmin(adminId))) {
      return NextResponse.json({ error: '无权限' }, { status: 403 });
    }
    
    const client = getSupabaseClient();
    
    await client
      .from('users')
      .update({ is_admin: isAdmin })
      .eq('id', targetUserId);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin PUT error:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
