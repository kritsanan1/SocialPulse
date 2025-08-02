import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  decimal,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (mandatory for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (mandatory for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Posts table
export const posts = pgTable("posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  content: text("content").notNull(),
  platforms: text("platforms").array().notNull(),
  mediaUrl: varchar("media_url"),
  scheduleDate: timestamp("schedule_date").notNull(),
  profileKey: varchar("profile_key"),
  userId: varchar("user_id").references(() => users.id).notNull(),
  status: varchar("status").notNull().default("scheduled"), // scheduled, published, failed
  createdAt: timestamp("created_at").defaultNow(),
});

// Post history table
export const postHistory = pgTable("post_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  postId: varchar("post_id").references(() => posts.id).notNull(),
  status: varchar("status").notNull(),
  response: jsonb("response"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Analytics table
export const analytics = pgTable("analytics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  postId: varchar("post_id").references(() => posts.id).notNull(),
  platform: varchar("platform").notNull(),
  engagementRate: decimal("engagement_rate", { precision: 5, scale: 2 }),
  reach: integer("reach"),
  impressions: integer("impressions"),
  likes: integer("likes"),
  shares: integer("shares"),
  comments: integer("comments"),
  clicks: integer("clicks"),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

// Teams table
export const teams = pgTable("teams", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  teamMemberId: varchar("team_member_id").references(() => users.id).notNull(),
  role: varchar("role").notNull().default("member"), // owner, admin, member
  createdAt: timestamp("created_at").defaultNow(),
});

// AI Suggestions table
export const aiSuggestions = pgTable("ai_suggestions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  postId: varchar("post_id").references(() => posts.id),
  userId: varchar("user_id").references(() => users.id).notNull(),
  suggestionType: varchar("suggestion_type").notNull(), // content, timing, hashtags, engagement
  suggestionContent: text("suggestion_content").notNull(),
  applied: boolean("applied").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Schema types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export const insertPostSchema = createInsertSchema(posts).omit({
  id: true,
  userId: true,
  status: true,
  createdAt: true,
});

export const insertAnalyticsSchema = createInsertSchema(analytics).omit({
  id: true,
  lastUpdated: true,
});

export const insertTeamSchema = createInsertSchema(teams).omit({
  id: true,
  createdAt: true,
});

export const insertAiSuggestionSchema = createInsertSchema(aiSuggestions).omit({
  id: true,
  userId: true,
  applied: true,
  createdAt: true,
});

export type InsertPost = z.infer<typeof insertPostSchema>;
export type Post = typeof posts.$inferSelect;
export type PostHistory = typeof postHistory.$inferSelect;
export type Analytics = typeof analytics.$inferSelect;
export type Team = typeof teams.$inferSelect;
export type AiSuggestion = typeof aiSuggestions.$inferSelect;
export type InsertAnalytics = z.infer<typeof insertAnalyticsSchema>;
export type InsertTeam = z.infer<typeof insertTeamSchema>;
export type InsertAiSuggestion = z.infer<typeof insertAiSuggestionSchema>;
