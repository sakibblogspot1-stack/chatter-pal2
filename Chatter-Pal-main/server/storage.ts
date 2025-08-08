import { eq, desc, and } from "drizzle-orm";
import { db } from "./db";
import { nanoid } from "nanoid";
import { 
  users,
  voiceSessions, 
  sessionFeedback,
  userProgress,
  type User, 
  type InsertUser, 
  type VoiceSession, 
  type InsertVoiceSession,
  type SessionFeedback,
  type InsertSessionFeedback,
  type UserProgress,
  type InsertUserProgress
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;

  // Voice session methods
  createVoiceSession(session: InsertVoiceSession): Promise<VoiceSession>;
  getVoiceSession(id: string): Promise<VoiceSession | undefined>;
  updateVoiceSession(id: string, updates: Partial<VoiceSession>): Promise<VoiceSession | undefined>;
  getUserSessions(userId: string, limit?: number): Promise<VoiceSession[]>;
  getActiveSession(userId: string): Promise<VoiceSession | undefined>;

  // Session feedback methods
  createSessionFeedback(feedback: InsertSessionFeedback): Promise<SessionFeedback>;
  getSessionFeedback(sessionId: string): Promise<SessionFeedback[]>;

  // User progress methods
  getUserProgress(userId: string): Promise<UserProgress | undefined>;
  createUserProgress(progress: InsertUserProgress): Promise<UserProgress>;
  updateUserProgress(userId: string, updates: Partial<UserProgress>): Promise<UserProgress | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private voiceSessions: Map<string, VoiceSession>;
  private sessionFeedback: Map<string, SessionFeedback>;
  private userProgress: Map<string, UserProgress>;

  constructor() {
    this.users = new Map();
    this.voiceSessions = new Map();
    this.sessionFeedback = new Map();
    this.userProgress = new Map();
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = nanoid();
    const user: User = { 
      ...insertUser, 
      id, 
      personalityType: null,
      level: "Beginner",
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Voice session methods
  async createVoiceSession(insertSession: InsertVoiceSession): Promise<VoiceSession> {
    const id = nanoid();
    const session: VoiceSession = {
      ...insertSession,
      id,
      wordsPerMinute: null,
      clarityScore: null,
      confidenceLevel: null,
      transcript: null,
      personalityInsights: null,
      feedbackItems: null,
      fillerWordCount: insertSession.fillerWordCount ?? 0,
      isActive: insertSession.isActive ?? false,
      createdAt: new Date()
    };
    this.voiceSessions.set(id, session);
    return session;
  }

  async getVoiceSession(id: string): Promise<VoiceSession | undefined> {
    return this.voiceSessions.get(id);
  }

  async updateVoiceSession(id: string, updates: Partial<VoiceSession>): Promise<VoiceSession | undefined> {
    const session = this.voiceSessions.get(id);
    if (!session) return undefined;
    
    const updatedSession = { ...session, ...updates };
    this.voiceSessions.set(id, updatedSession);
    return updatedSession;
  }

  async getUserSessions(userId: string, limit = 10): Promise<VoiceSession[]> {
    return Array.from(this.voiceSessions.values())
      .filter(session => session.userId === userId)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
      .slice(0, limit);
  }

  async getActiveSession(userId: string): Promise<VoiceSession | undefined> {
    return Array.from(this.voiceSessions.values())
      .find(session => session.userId === userId && session.isActive);
  }

  // Session feedback methods
  async createSessionFeedback(insertFeedback: InsertSessionFeedback): Promise<SessionFeedback> {
    const id = nanoid();
    const feedback: SessionFeedback = {
      ...insertFeedback,
      id,
      timestamp: new Date()
    };
    this.sessionFeedback.set(id, feedback);
    return feedback;
  }

  async getSessionFeedback(sessionId: string): Promise<SessionFeedback[]> {
    return Array.from(this.sessionFeedback.values())
      .filter(feedback => feedback.sessionId === sessionId)
      .sort((a, b) => new Date(a.timestamp!).getTime() - new Date(b.timestamp!).getTime());
  }

  // User progress methods
  async getUserProgress(userId: string): Promise<UserProgress | undefined> {
    return Array.from(this.userProgress.values())
      .find(progress => progress.userId === userId);
  }

  async createUserProgress(insertProgress: InsertUserProgress): Promise<UserProgress> {
    const id = nanoid();
    const progress: UserProgress = {
      ...insertProgress,
      id,
      totalSpeakingTime: insertProgress.totalSpeakingTime ?? 0,
      streakDays: insertProgress.streakDays ?? 0,
      trackedIssues: insertProgress.trackedIssues ?? {},
      personalityTraits: insertProgress.personalityTraits ?? {},
      improvementAreas: insertProgress.improvementAreas ?? {},
      lastSessionAt: insertProgress.lastSessionAt ?? null,
      updatedAt: new Date()
    };
    this.userProgress.set(id, progress);
    return progress;
  }

  async updateUserProgress(userId: string, updates: Partial<UserProgress>): Promise<UserProgress | undefined> {
    const existing = await this.getUserProgress(userId);
    if (!existing) return undefined;
    
    const updatedProgress = { 
      ...existing, 
      ...updates, 
      updatedAt: new Date() 
    };
    this.userProgress.set(existing.id, updatedProgress);
    return updatedProgress;
  }
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  // Voice session methods
  async createVoiceSession(insertSession: InsertVoiceSession): Promise<VoiceSession> {
    const [session] = await db
      .insert(voiceSessions)
      .values(insertSession)
      .returning();
    return session;
  }

  async getVoiceSession(id: string): Promise<VoiceSession | undefined> {
    const [session] = await db.select().from(voiceSessions).where(eq(voiceSessions.id, id));
    return session || undefined;
  }

  async updateVoiceSession(id: string, updates: Partial<VoiceSession>): Promise<VoiceSession | undefined> {
    const [session] = await db
      .update(voiceSessions)
      .set(updates)
      .where(eq(voiceSessions.id, id))
      .returning();
    return session || undefined;
  }

  async getUserSessions(userId: string, limit: number = 10): Promise<VoiceSession[]> {
    return await db
      .select()
      .from(voiceSessions)
      .where(eq(voiceSessions.userId, userId))
      .orderBy(desc(voiceSessions.createdAt))
      .limit(limit);
  }

  async getActiveSession(userId: string): Promise<VoiceSession | undefined> {
    const [session] = await db
      .select()
      .from(voiceSessions)
      .where(and(eq(voiceSessions.userId, userId), eq(voiceSessions.isActive, true)));
    return session || undefined;
  }

  // Session feedback methods
  async createSessionFeedback(insertFeedback: InsertSessionFeedback): Promise<SessionFeedback> {
    const [feedback] = await db
      .insert(sessionFeedback)
      .values(insertFeedback)
      .returning();
    return feedback;
  }

  async getSessionFeedback(sessionId: string): Promise<SessionFeedback[]> {
    return await db
      .select()
      .from(sessionFeedback)
      .where(eq(sessionFeedback.sessionId, sessionId))
      .orderBy(desc(sessionFeedback.timestamp));
  }

  // User progress methods
  async getUserProgress(userId: string): Promise<UserProgress | undefined> {
    const [progress] = await db
      .select()
      .from(userProgress)
      .where(eq(userProgress.userId, userId));
    return progress || undefined;
  }

  async createUserProgress(insertProgress: InsertUserProgress): Promise<UserProgress> {
    const [progress] = await db
      .insert(userProgress)
      .values(insertProgress)
      .returning();
    return progress;
  }

  async updateUserProgress(userId: string, updates: Partial<UserProgress>): Promise<UserProgress | undefined> {
    const [progress] = await db
      .update(userProgress)
      .set(updates)
      .where(eq(userProgress.userId, userId))
      .returning();
    return progress || undefined;
  }
}

// Use in-memory storage for development, database storage for production
export const storage = process.env.NODE_ENV === 'development' 
  ? new MemStorage() 
  : new DatabaseStorage();
