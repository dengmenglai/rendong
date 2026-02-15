import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

// 获取评论列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const recordingId = searchParams.get('recordingId');
    
    if (!recordingId) {
      return NextResponse.json({ error: '缺少录音ID' }, { status: 400 });
    }
    
    const client = getSupabaseClient();
    
    const { data: comments, error } = await client
      .from('comments')
      .select(`
        id,
        recording_id,
        user_id,
        content,
        created_at,
        users (
          id,
          username,
          avatar
        )
      `)
      .eq('recording_id', parseInt(recordingId))
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error('Fetch comments error:', error);
      return NextResponse.json({ error: '获取失败' }, { status: 500 });
    }
    
    return NextResponse.json({ comments: comments || [] });
  } catch (error) {
    console.error('Comments GET error:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}

// 创建评论
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { recordingId, userId, content } = body;
    
    if (!recordingId || !userId || !content?.trim()) {
      return NextResponse.json({ error: '缺少必要参数' }, { status: 400 });
    }
    
    const client = getSupabaseClient();
    
    const { data: comment, error } = await client
      .from('comments')
      .insert({
        recording_id: parseInt(recordingId),
        user_id: parseInt(userId),
        content: content.trim(),
      })
      .select(`
        id,
        recording_id,
        user_id,
        content,
        created_at,
        users (
          id,
          username,
          avatar
        )
      `)
      .single();
    
    if (error) {
      console.error('Insert comment error:', error);
      return NextResponse.json({ error: '评论失败' }, { status: 500 });
    }
    
    return NextResponse.json({ comment });
  } catch (error) {
    console.error('Comment POST error:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}

// 删除评论
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get('id');
    const userId = searchParams.get('userId');
    
    if (!commentId || !userId) {
      return NextResponse.json({ error: '缺少必要参数' }, { status: 400 });
    }
    
    const client = getSupabaseClient();
    
    // 先查询评论，确认是用户自己的
    const { data: comment, error: fetchError } = await client
      .from('comments')
      .select('id, user_id')
      .eq('id', parseInt(commentId))
      .single();
    
    if (fetchError || !comment) {
      return NextResponse.json({ error: '评论不存在' }, { status: 404 });
    }
    
    if (comment.user_id !== parseInt(userId)) {
      return NextResponse.json({ error: '无权删除' }, { status: 403 });
    }
    
    const { error: deleteError } = await client
      .from('comments')
      .delete()
      .eq('id', parseInt(commentId));
    
    if (deleteError) {
      console.error('Delete comment error:', deleteError);
      return NextResponse.json({ error: '删除失败' }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Comment DELETE error:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
