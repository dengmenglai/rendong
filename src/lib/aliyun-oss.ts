import OSS from 'ali-oss';

// 获取 OSS 配置（运行时读取）
function getOssConfig() {
  return {
    region: process.env.ALIYUN_OSS_REGION || 'oss-cn-hangzhou',
    bucket: process.env.ALIYUN_OSS_BUCKET || '',
    accessKeyId: process.env.ALIYUN_ACCESS_KEY_ID || '',
    accessKeySecret: process.env.ALIYUN_ACCESS_KEY_SECRET || '',
  };
}

// 获取 OSS 客户端
function getOssClient() {
  const config = getOssConfig();
  return new OSS({
    region: config.region,
    bucket: config.bucket,
    accessKeyId: config.accessKeyId,
    accessKeySecret: config.accessKeySecret,
  });
}

// 上传文件
export async function uploadFile(
  fileContent: Buffer,
  fileName: string,
  contentType: string = 'audio/webm'
): Promise<string> {
  const client = getOssClient();
  
  const result = await client.put(fileName, fileContent, {
    headers: {
      'Content-Type': contentType,
    },
  });
  
  return fileName;
}

// 获取文件签名 URL（用于播放）
export async function getSignedUrlForKey(key: string, expiresIn: number = 3600): Promise<string> {
  const client = getOssClient();
  
  const url = client.signatureUrl(key, {
    expires: expiresIn,
  });
  
  return url;
}

// 删除文件
export async function deleteFile(key: string): Promise<void> {
  const client = getOssClient();
  
  await client.delete(key);
}

// 检查配置是否完整
export function isOssConfigured(): boolean {
  const config = getOssConfig();
  
  return !!(
    config.accessKeyId &&
    config.accessKeySecret &&
    config.bucket
  );
}
