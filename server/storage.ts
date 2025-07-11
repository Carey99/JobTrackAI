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

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private jobApplications: Map<number, JobApplication> = new Map();
  private aiFeedback: Map<number, AIFeedback> = new Map();
  private currentJobApplicationId = 1;
  private currentAIFeedbackId = 1;

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const existingUser = this.users.get(userData.id);
    const user: User = {
      ...userData,
      email: userData.email || null,
      firstName: userData.firstName || null,
      lastName: userData.lastName || null,
      profileImageUrl: userData.profileImageUrl || null,
      updatedAt: new Date(),
      createdAt: existingUser?.createdAt || new Date(),
    };
    this.users.set(userData.id, user);
    return user;
  }

  // Job application operations
  async getUserJobApplications(userId: string): Promise<JobApplication[]> {
    return Array.from(this.jobApplications.values()).filter(app => app.userId === userId);
  }

  async createJobApplication(userId: string, application: InsertJobApplication): Promise<JobApplication> {
    const id = this.currentJobApplicationId++;
    const newApplication: JobApplication = {
      ...application,
      id,
      userId,
      status: application.status || "Applied",
      location: application.location || null,
      salaryRange: application.salaryRange || null,
      jobDescriptionUrl: application.jobDescriptionUrl || null,
      notes: application.notes || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.jobApplications.set(id, newApplication);
    return newApplication;
  }

  async updateJobApplication(id: number, userId: string, application: Partial<InsertJobApplication>): Promise<JobApplication | undefined> {
    const existing = this.jobApplications.get(id);
    if (!existing || existing.userId !== userId) {
      return undefined;
    }

    const updated: JobApplication = {
      ...existing,
      ...application,
      updatedAt: new Date(),
    };
    this.jobApplications.set(id, updated);
    return updated;
  }

  async deleteJobApplication(id: number, userId: string): Promise<boolean> {
    const existing = this.jobApplications.get(id);
    if (!existing || existing.userId !== userId) {
      return false;
    }
    return this.jobApplications.delete(id);
  }

  async getJobApplication(id: number, userId: string): Promise<JobApplication | undefined> {
    const application = this.jobApplications.get(id);
    if (!application || application.userId !== userId) {
      return undefined;
    }
    return application;
  }

  // AI feedback operations
  async createAIFeedback(userId: string, feedback: InsertAIFeedback): Promise<AIFeedback> {
    const id = this.currentAIFeedbackId++;
    const newFeedback: AIFeedback = {
      ...feedback,
      id,
      userId,
      matchScore: feedback.matchScore || null,
      strengths: feedback.strengths || null,
      improvements: feedback.improvements || null,
      recommendations: feedback.recommendations || null,
      createdAt: new Date(),
    };
    this.aiFeedback.set(id, newFeedback);
    return newFeedback;
  }

  async getUserAIFeedback(userId: string): Promise<AIFeedback[]> {
    return Array.from(this.aiFeedback.values()).filter(feedback => feedback.userId === userId);
  }
}

export const storage = new MemStorage();
