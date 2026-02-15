import { pgTable, serial, varchar, timestamp, integer, text, index } from "drizzle-orm/pg-core"

// 用户表 - 简单的用户信息
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  avatar: varchar("avatar", { length: 10 }).notNull().default("👤"),
  created_at: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

// 录音作品表
export const recordings = pgTable("recordings", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").notNull().references(() => users.id),
  article_id: integer("article_id").notNull(),
  article_title: varchar("article_title", { length: 200 }).notNull(),
  audio_key: varchar("audio_key", { length: 500 }).notNull(),
  duration: integer("duration").notNull().default(0),
  comment: text("comment"),
  likes: integer("likes").notNull().default(0),
  created_at: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
  index("idx_recordings_article").on(table.article_id),
  index("idx_recordings_created").on(table.created_at),
]);

// 点赞表
export const likes = pgTable("likes", {
  id: serial("id").primaryKey(),
  recording_id: integer("recording_id").notNull().references(() => recordings.id),
  user_id: integer("user_id").notNull().references(() => users.id),
  created_at: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
  index("idx_likes_recording").on(table.recording_id),
  index("idx_likes_user").on(table.user_id),
]);

// 用户签到记录表
export const checkIns = pgTable("check_ins", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").notNull().references(() => users.id),
  check_date: varchar("check_date", { length: 20 }).notNull(),
  created_at: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
  index("idx_checkins_user_date").on(table.user_id, table.check_date),
]);

// 用户学习统计表
export const studyStats = pgTable("study_stats", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").notNull().references(() => users.id).unique(),
  total_days: integer("total_days").notNull().default(0),
  streak: integer("streak").notNull().default(0),
  last_check_date: varchar("last_check_date", { length: 20 }),
  articles_read: text("articles_read").default("[]"),
  words_learned: integer("words_learned").notNull().default(0),
  today_seconds: integer("today_seconds").notNull().default(0),
  week_seconds: integer("week_seconds").notNull().default(0),
  month_seconds: integer("month_seconds").notNull().default(0),
  daily_goal: integer("daily_goal").notNull().default(30),
  updated_at: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});
