import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import type { S3Client as S3ClientType } from '@aws-sdk/client-s3';

// 阿里云 OSS 配置
const ossConfig = {
  region: process.env.ALIYUN_OSS_REGION || 'oss-cn-hangzhou',
  endpoint: process.env.ALIYUN_OSS_ENDPOINT || 'https://oss-cn-hangzhou.aliyuncs.com',
  credentials: {
    accessKeyId: process.env.ALIYUN_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.ALIYUN_ACCESS_KEY_SECRET || '',
  },
  bucket: process.env.ALIYUN_OSS_BUCKET || '',
};

// 创建 S3 客户端（阿里云 OSS 兼容 S3 协议）
const s3Client = new S3Client({
  region: ossConfig.region,
  endpoint: ossConfig.endpoint,
  credentials: ossConfig.credentials,
  forcePathStyle: false,
}) as S3ClientType;

// 上传文件
export async function uploadFile(
  fileContent: Buffer,
  fileName: string,
  contentType: string = 'audio/webm'
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: ossConfig.bucket,
    Key: fileName,
    Body: fileContent,
    ContentType: contentType,
  });

  await s3Client.send(command);
  return fileName;
}

// 获取文件签名 URL（用于播放）
export async function getSignedUrlForKey(key: string, expiresIn: number = 3600): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: ossConfig.bucket,
    Key: key,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return await getSignedUrl(s3Client as any, command, { expiresIn });
}

// 删除文件
export async function deleteFile(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: ossConfig.bucket,
    Key: key,
  });

  await s3Client.send(command);
}

// 检查配置是否完整
export function isOssConfigured(): boolean {
  return !!(
    ossConfig.credentials.accessKeyId &&
    ossConfig.credentials.secretAccessKey &&
    ossConfig.bucket
  );
}
