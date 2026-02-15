-- 评论表迁移脚本
-- 在 Supabase SQL Editor 中执行此脚本

-- 创建评论表
CREATE TABLE IF NOT EXISTS comments (
  id SERIAL PRIMARY KEY,
  recording_id INTEGER NOT NULL REFERENCES recordings(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_comments_recording ON comments(recording_id);
CREATE INDEX IF NOT EXISTS idx_comments_created ON comments(created_at);

-- 启用 RLS (Row Level Security)
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- 允许所有人查看评论
CREATE POLICY "允许所有人查看评论" ON comments
  FOR SELECT USING (true);

-- 允许登录用户创建评论
CREATE POLICY "允许登录用户创建评论" ON comments
  FOR INSERT WITH CHECK (true);

-- 允许用户删除自己的评论
CREATE POLICY "允许用户删除自己的评论" ON comments
  FOR DELETE USING (user_id = current_setting('request.jwt.claims')::json->>'sub'::INTEGER);
