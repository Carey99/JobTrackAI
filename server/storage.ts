import {
  type User,
  type UpsertUser,
  type JobApplication,
  type InsertJobApplication,
  type AIFeedback,
  type InsertAIFeedback,
} from "@shared/schema";
import UserModel from "./models/User";
import JobApplicationModel from "./models/JobApplication";
import AIFeedbackModel from "./models/AIFeedback";

// Interface for storage operations
export interface IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Job application operations
  getUserJobApplications(userId: string): Promise<JobApplication[]>;
  createJobApplication(userId: string, application: InsertJobApplication): Promise<JobApplication>;
  updateJobApplication(id: string, userId: string, application: Partial<InsertJobApplication>): Promise<JobApplication | undefined>;
  deleteJobApplication(id: string, userId: string): Promise<boolean>;
  getJobApplication(id: string, userId: string): Promise<JobApplication | undefined>;
  
  // AI feedback operations
  createAIFeedback(userId: string, feedback: InsertAIFeedback): Promise<AIFeedback>;
  getUserAIFeedback(userId: string): Promise<AIFeedback[]>;
}

export class MongoStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const user = await UserModel.findOne({ id });
    if (!user) return undefined;
    
    return {
      id: user.id,
      email: user.email || null,
      firstName: user.firstName || null,
      lastName: user.lastName || null,
      profileImageUrl: user.profileImageUrl || null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const user = await UserModel.findOneAndUpdate(
      { id: userData.id },
      userData,
      { new: true, upsert: true }
    );
    
    return {
      id: user.id,
      email: user.email || null,
      firstName: user.firstName || null,
      lastName: user.lastName || null,
      profileImageUrl: user.profileImageUrl || null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  // Job application operations
  async getUserJobApplications(userId: string): Promise<JobApplication[]> {
    const applications = await JobApplicationModel.find({ userId });
    return applications.map(app => ({
      id: app._id.toString(),
      userId: app.userId,
      company: app.company,
      position: app.position,
      location: app.location || null,
      salaryRange: app.salaryRange || null,
      status: app.status,
      applicationDate: app.applicationDate.toISOString().split('T')[0],
      jobDescriptionUrl: app.jobDescriptionUrl || null,
      notes: app.notes || null,
      createdAt: app.createdAt,
      updatedAt: app.updatedAt,
    }));
  }

  async createJobApplication(userId: string, application: InsertJobApplication): Promise<JobApplication> {
    const newApplication = await JobApplicationModel.create({
      ...application,
      userId,
    });
    
    return {
      id: newApplication._id.toString(),
      userId: newApplication.userId,
      company: newApplication.company,
      position: newApplication.position,
      location: newApplication.location || null,
      salaryRange: newApplication.salaryRange || null,
      status: newApplication.status,
      applicationDate: newApplication.applicationDate.toISOString().split('T')[0],
      jobDescriptionUrl: newApplication.jobDescriptionUrl || null,
      notes: newApplication.notes || null,
      createdAt: newApplication.createdAt,
      updatedAt: newApplication.updatedAt,
    };
  }

  async updateJobApplication(id: string, userId: string, application: Partial<InsertJobApplication>): Promise<JobApplication | undefined> {
    const updated = await JobApplicationModel.findOneAndUpdate(
      { _id: id, userId },
      application,
      { new: true }
    );
    
    if (!updated) return undefined;
    
    return {
      id: updated._id.toString(),
      userId: updated.userId,
      company: updated.company,
      position: updated.position,
      location: updated.location || null,
      salaryRange: updated.salaryRange || null,
      status: updated.status,
      applicationDate: updated.applicationDate.toISOString().split('T')[0],
      jobDescriptionUrl: updated.jobDescriptionUrl || null,
      notes: updated.notes || null,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  }

  async deleteJobApplication(id: string, userId: string): Promise<boolean> {
    const result = await JobApplicationModel.deleteOne({ _id: id, userId });
    return result.deletedCount > 0;
  }

  async getJobApplication(id: string, userId: string): Promise<JobApplication | undefined> {
    const application = await JobApplicationModel.findOne({ _id: id, userId });
    if (!application) return undefined;
    
    return {
      id: application._id.toString(),
      userId: application.userId,
      company: application.company,
      position: application.position,
      location: application.location || null,
      salaryRange: application.salaryRange || null,
      status: application.status,
      applicationDate: application.applicationDate.toISOString().split('T')[0],
      jobDescriptionUrl: application.jobDescriptionUrl || null,
      notes: application.notes || null,
      createdAt: application.createdAt,
      updatedAt: application.updatedAt,
    };
  }

  // AI feedback operations
  async createAIFeedback(userId: string, feedback: InsertAIFeedback): Promise<AIFeedback> {
    const newFeedback = await AIFeedbackModel.create({
      ...feedback,
      userId,
    });
    
    return {
      id: newFeedback._id.toString(),
      userId: newFeedback.userId,
      jobDescription: newFeedback.jobDescription,
      resume: newFeedback.resume,
      matchScore: newFeedback.matchScore || null,
      strengths: newFeedback.strengths || null,
      improvements: newFeedback.improvements || null,
      recommendations: newFeedback.recommendations || null,
      createdAt: newFeedback.createdAt,
    };
  }

  async getUserAIFeedback(userId: string): Promise<AIFeedback[]> {
    const feedbacks = await AIFeedbackModel.find({ userId });
    return feedbacks.map(feedback => ({
      id: feedback._id.toString(),
      userId: feedback.userId,
      jobDescription: feedback.jobDescription,
      resume: feedback.resume,
      matchScore: feedback.matchScore || null,
      strengths: feedback.strengths || null,
      improvements: feedback.improvements || null,
      recommendations: feedback.recommendations || null,
      createdAt: feedback.createdAt,
    }));
  }
}

export const storage = new MongoStorage();
