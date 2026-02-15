import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

// 点赞/取消点赞
export async function POST(request: NextRequest) {
  try {
    const { userId, recordingId } = await request.json();
    
    if (!userId || !recordingId) {
      return NextResponse.json({ error: '缺少必要参数' }, { status: 400 });
    }
    
    const client = getSupabaseClient();
    
    // 检查是否已点赞
    const { data: existingLike } = await client
      .from('likes')
      .select('*')
      .eq('user_id', userId)
      .eq('recording_id', recordingId)
      .single();
    
    if (existingLike) {
      // 取消点赞
      await client
        .from('likes')
        .delete()
        .eq('id', existingLike.id);
      
      // 减少点赞数
      await client.rpc('decrement_likes', { recording_id: recordingId });
      
      // 手动更新点赞数
      const { data: recording } = await client
        .from('recordings')
        .select('likes')
        .eq('id', recordingId)
        .single();
      
      const newLikes = Math.max(0, (recording?.likes || 1) - 1);
      await client
        .from('recordings')
        .update({ likes: newLikes })
        .eq('id', recordingId);
      
      return NextResponse.json({ liked: false, likes: newLikes });
    } else {
      // 添加点赞
      await client
        .from('likes')
        .insert({
          user_id: userId,
          recording_id: recordingId,
        });
      
      // 增加点赞数
      const { data: recording } = await client
        .from('recordings')
        .select('likes')
        .eq('id', recordingId)
        .single();
      
      const newLikes = (recording?.likes || 0) + 1;
      await client
        .from('recordings')
        .update({ likes: newLikes })
        .eq('id', recordingId);
      
      return NextResponse.json({ liked: true, likes: newLikes });
    }
  } catch (error) {
    console.error('Like API error:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
