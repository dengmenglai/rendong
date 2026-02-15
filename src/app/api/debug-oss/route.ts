import { NextResponse } from 'next/server';
import { getSignedUrlForKey, isOssConfigured } from '@/lib/aliyun-oss';

export async function GET() {
  const config = {
    bucket: process.env.ALIYUN_OSS_BUCKET || '',
    region: process.env.ALIYUN_OSS_REGION || '',
    endpoint: process.env.ALIYUN_OSS_ENDPOINT || '',
    hasKeyId: !!(process.env.ALIYUN_ACCESS_KEY_ID),
    hasKeySecret: !!(process.env.ALIYUN_ACCESS_KEY_SECRET),
  };
  
  // 尝试生成一个测试签名 URL
  let testUrl = null;
  let urlError = null;
  
  if (isOssConfigured()) {
    try {
      testUrl = await getSignedUrlForKey('recordings/14_1771140304434.webm', 3600);
    } catch (e) {
      urlError = e instanceof Error ? e.message : String(e);
    }
  }
  
  return NextResponse.json({
    configured: !!(config.bucket && config.hasKeyId && config.hasKeySecret),
    config: {
      bucket: config.bucket || '(未设置)',
      region: config.region || '(未设置)',
      endpoint: config.endpoint || '(未设置)',
      hasKeyId: config.hasKeyId,
      hasKeySecret: config.hasKeySecret,
    },
    testUrl: testUrl ? testUrl.substring(0, 100) + '...' : null,
    urlError,
  });
}
