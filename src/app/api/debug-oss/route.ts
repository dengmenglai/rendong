import { NextResponse } from 'next/server';

export async function GET() {
  const config = {
    bucket: process.env.ALIYUN_OSS_BUCKET || '',
    region: process.env.ALIYUN_OSS_REGION || '',
    endpoint: process.env.ALIYUN_OSS_ENDPOINT || '',
    hasKeyId: !!(process.env.ALIYUN_ACCESS_KEY_ID),
    hasKeySecret: !!(process.env.ALIYUN_ACCESS_KEY_SECRET),
  };
  
  return NextResponse.json({
    configured: !!(config.bucket && config.hasKeyId && config.hasKeySecret),
    config: {
      bucket: config.bucket || '(未设置)',
      region: config.region || '(未设置)',
      endpoint: config.endpoint || '(未设置)',
      hasKeyId: config.hasKeyId,
      hasKeySecret: config.hasKeySecret,
    },
  });
}
