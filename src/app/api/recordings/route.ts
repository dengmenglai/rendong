import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { S3Storage } from 'coze-coding-dev-sdk';

const storage = new S3Storage({
  endpointUrl: process.env.COZE_BUCKET_ENDPOINT_URL,
  accessKey: "",
  secretKey: "",
  bucketName: process.env.COZE_BUCKET_NAME,
  region: "cn-beijing",
});

// 获取录音列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const articleId = searchParams.get('articleId');
    const filter = searchParams.get('filter') || 'hot'; // hot | new
    const userId = searchParams.get('userId');
    
    const client = getSupabaseClient();
    
    let query = client
      .from('recordings')
      .select(`
        id,
        user_id,
        article_id,
        article_title,
        audio_key,
        duration,
        comment,
        likes,
        created_at,
        users (
          id,
          username,
          avatar
        )
      `);
    
    if (articleId) {
      query = query.eq('article_id', parseInt(articleId));
    }
    
    if (filter === 'hot') {
      query = query.order('likes', { ascending: false });
    } else {
      query = query.order('created_at', { ascending: false });
    }
    
    query = query.limit(50);
    
    const { data: recordings, error } = await query;
    
    if (error) {
      console.error('Fetch recordings error:', error);
      return NextResponse.json({ error: '获取失败' }, { status: 500 });
    }
    
    // 获取用户点赞状态
    let likedIds: number[] = [];
    if (userId) {
      const { data: likes } = await client
        .from('likes')
        .select('recording_id')
        .eq('user_id', parseInt(userId));
      
      likedIds = likes?.map((l: { recording_id: number }) => l.recording_id) || [];
    }
    
    // 生成签名URL
    const recordingsWithUrl = await Promise.all(
      (recordings || []).map(async (r: any) => {
        try {
          const audioUrl = await storage.generatePresignedUrl({
            key: r.audio_key,
            expireTime: 3600,
          });
          return {
            ...r,
            audio_url: audioUrl,
            liked: likedIds.includes(r.id),
          };
        } catch {
          return {
            ...r,
            audio_url: null,
            liked: likedIds.includes(r.id),
          };
        }
      })
    );
    
    return NextResponse.json({ recordings: recordingsWithUrl });
  } catch (error) {
    console.error('Recordings GET error:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}

// 上传录音
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const userId = formData.get('userId');
    const articleId = formData.get('articleId');
    const articleTitle = formData.get('articleTitle');
    const duration = formData.get('duration');
    const comment = formData.get('comment');
    const audioFile = formData.get('audio') as File;
    
    if (!userId || !articleId || !articleTitle || !audioFile) {
      return NextResponse.json({ error: '缺少必要参数' }, { status: 400 });
    }
    
    // 上传音频文件到对象存储
    const audioBuffer = Buffer.from(await audioFile.arrayBuffer());
    const fileName = `recordings/${userId}_${Date.now()}.webm`;
    
    const audioKey = await storage.uploadFile({
      fileContent: audioBuffer,
      fileName,
      contentType: audioFile.type || 'audio/webm',
    });
    
    // 保存到数据库
    const client = getSupabaseClient();
    const { data: recording, error } = await client
      .from('recordings')
      .insert({
        user_id: parseInt(userId as string),
        article_id: parseInt(articleId as string),
        article_title: articleTitle,
        audio_key: audioKey,
        duration: parseInt(duration as string) || 0,
        comment: comment as string || '',
      })
      .select(`
        id,
        user_id,
        article_id,
        article_title,
        audio_key,
        duration,
        comment,
        likes,
        created_at,
        users (
          id,
          username,
          avatar
        )
      `)
      .single();
    
    if (error) {
      console.error('Insert recording error:', error);
      return NextResponse.json({ error: '保存失败' }, { status: 500 });
    }
    
    // 生成签名URL
    const audioUrl = await storage.generatePresignedUrl({
      key: audioKey,
      expireTime: 3600,
    });
    
    return NextResponse.json({
      recording: {
        ...recording,
        audio_url: audioUrl,
        liked: false,
      },
    });
  } catch (error) {
    console.error('Recording POST error:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
