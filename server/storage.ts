import {
  users,
  jobApplications,
  aiFeedback,
  type User,
  type UpsertUser,
  type JobApplication,
  type InsertJobApplication,
  type AIFeedback,
  type InsertAIFeedback,
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Job application operations
  getUserJobApplications(userId: string): Promise<JobApplication[]>;
  createJobApplication(userId: string, application: InsertJobApplication): Promise<JobApplication>;
  updateJobApplication(id: number, userId: string, application: Partial<InsertJobApplication>): Promise<JobApplication | undefined>;
  deleteJobApplication(id: number, userId: string): Promise<boolean>;
  getJobApplication(id: number, userId: string): Promise<JobApplication | undefined>;
  
  // AI feedback operations
  createAIFeedback(userId: string, feedback: InsertAIFeedback): Promise<AIFeedback>;
  getUserAIFeedback(userId: string): Promise<AIFeedback[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Job application operations
  async getUserJobApplications(userId: string): Promise<JobApplication[]> {
    return await db.select().from(jobApplications).where(eq(jobApplications.userId, userId));
  }

  async createJobApplication(userId: string, application: InsertJobApplication): Promise<JobApplication> {
    const [newApplication] = await db
      .insert(jobApplications)
      .values({
        ...application,
        userId,
      })
      .returning();
    return newApplication;
  }

  async updateJobApplication(id: number, userId: string, application: Partial<InsertJobApplication>): Promise<JobApplication | undefined> {
    const [updated] = await db
      .update(jobApplications)
      .set({
        ...application,
        updatedAt: new Date(),
      })
      .where(and(eq(jobApplications.id, id), eq(jobApplications.userId, userId)))
      .returning();
    return updated || undefined;
  }

  async deleteJobApplication(id: number, userId: string): Promise<boolean> {
    const result = await db
      .delete(jobApplications)
      .where(and(eq(jobApplications.id, id), eq(jobApplications.userId, userId)))
      .returning();
    return result.length > 0;
  }

  async getJobApplication(id: number, userId: string): Promise<JobApplication | undefined> {
    const [application] = await db
      .select()
      .from(jobApplications)
      .where(and(eq(jobApplications.id, id), eq(jobApplications.userId, userId)));
    return application || undefined;
  }

  // AI feedback operations
  async createAIFeedback(userId: string, feedback: InsertAIFeedback): Promise<AIFeedback> {
    const [newFeedback] = await db
      .insert(aiFeedback)
      .values({
        ...feedback,
        userId,
      })
      .returning();
    return newFeedback;
  }

  async getUserAIFeedback(userId: string): Promise<AIFeedback[]> {
    return await db.select().from(aiFeedback).where(eq(aiFeedback.userId, userId));
  }
}

export const storage = new DatabaseStorage();
