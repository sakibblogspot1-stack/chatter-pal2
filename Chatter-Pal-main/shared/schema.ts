import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  personalityType: text("personality_type"),
  level: text("level").default("Beginner"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const voiceSessions = pgTable("voice_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  duration: integer("duration").notNull(), // in seconds
  wordsPerMinute: integer("words_per_minute"),
  clarityScore: integer("clarity_score"), // 0-100
  fillerWordCount: integer("filler_word_count").default(0),
  confidenceLevel: integer("confidence_level"), // 0-100
  transcript: text("transcript"),
  personalityInsights: jsonb("personality_insights"),
  feedbackItems: jsonb("feedback_items"), // array of feedback objects
  isActive: boolean("is_active").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const sessionFeedback = pgTable("session_feedback", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").references(() => voiceSessions.id).notNull(),
  type: text("type").notNull(), // 'suggestion', 'praise', 'correction'
  category: text("category").notNull(), // 'grammar', 'pace', 'personality', 'filler'
  message: text("message").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const userProgress = pgTable("user_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  totalSpeakingTime: integer("total_speaking_time").default(0), // in seconds
  streakDays: integer("streak_days").default(0),
  trackedIssues: jsonb("tracked_issues"), // { issueType: count }
  personalityTraits: jsonb("personality_traits"), // detected traits over time
  improvementAreas: jsonb("improvement_areas"), // areas to focus on
  lastSessionAt: timestamp("last_session_at"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertVoiceSessionSchema = createInsertSchema(voiceSessions).omit({
  id: true,
  createdAt: true,
});

export const insertSessionFeedbackSchema = createInsertSchema(sessionFeedback).omit({
  id: true,
  timestamp: true,
});

export const insertUserProgressSchema = createInsertSchema(userProgress).omit({
  id: true,
  updatedAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertVoiceSession = z.infer<typeof insertVoiceSessionSchema>;
export type VoiceSession = typeof voiceSessions.$inferSelect;

export type InsertSessionFeedback = z.infer<typeof insertSessionFeedbackSchema>;
export type SessionFeedback = typeof sessionFeedback.$inferSelect;

export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type UserProgress = typeof userProgress.$inferSelect;

// WebSocket message types
export const wsMessageSchema = z.object({
  type: z.enum(['start_session', 'end_session', 'audio_data', 'feedback', 'metrics_update']),
  data: z.any(),
  sessionId: z.string().optional(),
});

export type WSMessage = z.infer<typeof wsMessageSchema>;

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  voiceSessions: many(voiceSessions),
  progress: many(userProgress),
}));

export const voiceSessionsRelations = relations(voiceSessions, ({ one, many }) => ({
  user: one(users, {
    fields: [voiceSessions.userId],
    references: [users.id],
  }),
  feedback: many(sessionFeedback),
}));

export const sessionFeedbackRelations = relations(sessionFeedback, ({ one }) => ({
  session: one(voiceSessions, {
    fields: [sessionFeedback.sessionId],
    references: [voiceSessions.id],
  }),
}));

export const userProgressRelations = relations(userProgress, ({ one }) => ({
  user: one(users, {
    fields: [userProgress.userId],
    references: [users.id],
  }),
}));
