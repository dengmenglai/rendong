import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import type { S3Client as S3ClientType } from '@aws-sdk/client-s3';

// 获取 OSS 配置（运行时读取）
function getOssConfig() {
  return {
    region: process.env.ALIYUN_OSS_REGION || 'oss-cn-hangzhou',
    endpoint: process.env.ALIYUN_OSS_ENDPOINT || `https://${process.env.ALIYUN_OSS_REGION || 'oss-cn-hangzhou'}.aliyuncs.com`,
    credentials: {
      accessKeyId: process.env.ALIYUN_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.ALIYUN_ACCESS_KEY_SECRET || '',
    },
    bucket: process.env.ALIYUN_OSS_BUCKET || '',
  };
}

// 获取 S3 客户端
function getS3Client() {
  const config = getOssConfig();
  // 使用虚拟主机风格：https://bucket.oss-region.aliyuncs.com
  const endpoint = `https://${config.bucket}.${config.region}.aliyuncs.com`;
  return new S3Client({
    region: config.region,
    endpoint: endpoint,
    credentials: config.credentials,
    forcePathStyle: false, // 虚拟主机风格
  }) as S3ClientType;
}

// 上传文件
export async function uploadFile(
  fileContent: Buffer,
  fileName: string,
  contentType: string = 'audio/webm'
): Promise<string> {
  const config = getOssConfig();
  const client = getS3Client();
  
  const command = new PutObjectCommand({
    Bucket: config.bucket,
    Key: fileName,
    Body: fileContent,
    ContentType: contentType,
  });

  await client.send(command);
  return fileName;
}

// 获取文件签名 URL（用于播放）
export async function getSignedUrlForKey(key: string, expiresIn: number = 3600): Promise<string> {
  const config = getOssConfig();
  const client = getS3Client();
  
  const command = new GetObjectCommand({
    Bucket: config.bucket,
    Key: key,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return await getSignedUrl(client as any, command, { expiresIn });
}

// 删除文件
export async function deleteFile(key: string): Promise<void> {
  const config = getOssConfig();
  const client = getS3Client();
  
  const command = new DeleteObjectCommand({
    Bucket: config.bucket,
    Key: key,
  });

  await client.send(command);
}

// 检查配置是否完整
export function isOssConfigured(): boolean {
  const config = getOssConfig();
  console.log('OSS Config check:', {
    hasKeyId: !!config.credentials.accessKeyId,
    hasKeySecret: !!config.credentials.secretAccessKey,
    hasBucket: !!config.bucket,
    bucket: config.bucket,
  });
  
  return !!(
    config.credentials.accessKeyId &&
    config.credentials.secretAccessKey &&
    config.bucket
  );
}
