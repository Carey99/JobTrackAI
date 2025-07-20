import {
  type User,
  type UpsertUser,
  type JobApplication,
  type InsertJobApplication,
  type AIFeedback,
  type InsertAIFeedback,
  type UserProfile,
  type InsertUserProfile,
} from "@shared/schema";
import UserModel from "./models/User";
import JobApplicationModel from "./models/JobApplication";
import AIFeedbackModel from "./models/AIFeedback";
import UserProfileModel from "./models/UserProfile";
import UserAuthModel from "./models/UserAuth";

// Interface for storage operations
export interface IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>; // New method
  upsertUser(user: UpsertUser): Promise<User>;
  createUserAuth(userId: string, email: string, hashedPassword: string): Promise<void>; // New method
  getUserAuth(email: string): Promise<{ userId: string; hashedPassword: string } | undefined>; // New method
  
  // User profile operations
  getUserProfile(userId: string): Promise<UserProfile | undefined>;
  updateUserProfile(userId: string, profile: InsertUserProfile): Promise<UserProfile>;
  getUserAnalytics(userId: string, timeRange?: string): Promise<any>;
  
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

  async getUserByEmail(email: string): Promise<User | undefined> {
    const user = await UserModel.findOne({ email });
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

  async createUserAuth(userId: string, email: string, hashedPassword: string): Promise<void> {
    await UserAuthModel.create({
      userId,
      email,
      hashedPassword,
    });
  }

  async getUserAuth(email: string): Promise<{ userId: string; hashedPassword: string } | undefined> {
    const auth = await UserAuthModel.findOne({ email });
    if (!auth) return undefined;
    
    return {
      userId: auth.userId,
      hashedPassword: auth.hashedPassword,
    };
  }

  // User profile operations
  async getUserProfile(userId: string): Promise<UserProfile | undefined> {
    const profile = await UserProfileModel.findOne({ userId });
    if (!profile) {
      // Return default profile structure
      return {
        id: '',
        userId,
        firstName: null,
        lastName: null,
        email: null,
        phone: null,
        location: null,
        linkedinUrl: null,
        portfolioUrl: null,
        currentTitle: null,
        yearsOfExperience: null,
        targetSalary: null,
        availabilityDate: null,
        workLocation: null,
        highestEducation: null,
        fieldOfStudy: null,
        university: null,
        graduationYear: null,
        skills: null,
        bio: null,
        careerObjective: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }
    
    return {
      id: profile._id.toString(),
      userId: profile.userId,
      firstName: profile.firstName || null,
      lastName: profile.lastName || null,
      email: profile.email || null,
      phone: profile.phone || null,
      location: profile.location || null,
      linkedinUrl: profile.linkedinUrl || null,
      portfolioUrl: profile.portfolioUrl || null,
      currentTitle: profile.currentTitle || null,
      yearsOfExperience: profile.yearsOfExperience || null,
      targetSalary: profile.targetSalary || null,
      availabilityDate: profile.availabilityDate || null,
      workLocation: profile.workLocation || null,
      highestEducation: profile.highestEducation || null,
      fieldOfStudy: profile.fieldOfStudy || null,
      university: profile.university || null,
      graduationYear: profile.graduationYear || null,
      skills: profile.skills || null,
      bio: profile.bio || null,
      careerObjective: profile.careerObjective || null,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    };
  }

  async updateUserProfile(userId: string, profileData: InsertUserProfile): Promise<UserProfile> {
    const profile = await UserProfileModel.findOneAndUpdate(
      { userId },
      { ...profileData, updatedAt: new Date() },
      { new: true, upsert: true }
    );
    
    return {
      id: profile._id.toString(),
      userId: profile.userId,
      firstName: profile.firstName || null,
      lastName: profile.lastName || null,
      email: profile.email || null,
      phone: profile.phone || null,
      location: profile.location || null,
      linkedinUrl: profile.linkedinUrl || null,
      portfolioUrl: profile.portfolioUrl || null,
      currentTitle: profile.currentTitle || null,
      yearsOfExperience: profile.yearsOfExperience || null,
      targetSalary: profile.targetSalary || null,
      availabilityDate: profile.availabilityDate || null,
      workLocation: profile.workLocation || null,
      highestEducation: profile.highestEducation || null,
      fieldOfStudy: profile.fieldOfStudy || null,
      university: profile.university || null,
      graduationYear: profile.graduationYear || null,
      skills: profile.skills || null,
      bio: profile.bio || null,
      careerObjective: profile.careerObjective || null,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    };
  }

  async getUserAnalytics(userId: string, timeRange: string = 'all'): Promise<any> {
    // Get all applications for the user
    const applications = await this.getUserJobApplications(userId);
    
    if (applications.length === 0) {
      return {
        totalApplications: 0,
        responseRate: 0,
        interviews: 0,
        thisMonth: 0,
        averageResponseTime: 0,
        topCompanies: [],
        applicationsByStatus: [],
        applicationsByMonth: [],
        topLocations: []
      };
    }

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Filter applications based on time range
    let filteredApps = applications;
    if (timeRange === 'month') {
      filteredApps = applications.filter(app => {
        const appDate = new Date(app.applicationDate);
        return appDate.getMonth() === currentMonth && appDate.getFullYear() === currentYear;
      });
    } else if (timeRange === 'quarter') {
      const quarterStart = new Date(currentYear, Math.floor(currentMonth / 3) * 3, 1);
      filteredApps = applications.filter(app => 
        new Date(app.applicationDate) >= quarterStart
      );
    }

    // Calculate metrics
    const totalApplications = filteredApps.length;
    const responded = filteredApps.filter(app => 
      app.status !== 'Applied' && app.status !== 'No Response'
    ).length;
    const responseRate = totalApplications > 0 ? Math.round((responded / totalApplications) * 100) : 0;
    const interviews = filteredApps.filter(app => 
      app.status === 'Interview' || app.status === 'Final Interview'
    ).length;
    const thisMonth = applications.filter(app => {
      const appDate = new Date(app.applicationDate);
      return appDate.getMonth() === currentMonth && appDate.getFullYear() === currentYear;
    }).length;

    // Company analysis
    const companyCount: { [key: string]: number } = {};
    filteredApps.forEach(app => {
      companyCount[app.company] = (companyCount[app.company] || 0) + 1;
    });
    const topCompanies = Object.entries(companyCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Status distribution
    const statusCount: { [key: string]: number } = {};
    filteredApps.forEach(app => {
      statusCount[app.status] = (statusCount[app.status] || 0) + 1;
    });
    const applicationsByStatus = Object.entries(statusCount)
      .map(([status, count]) => ({
        status,
        count,
        percentage: totalApplications > 0 ? Math.round((count / totalApplications) * 100) : 0
      }));

    // Location analysis
    const locationCount: { [key: string]: number } = {};
    filteredApps.forEach(app => {
      const location = app.location || 'Not specified';
      locationCount[location] = (locationCount[location] || 0) + 1;
    });
    const topLocations = Object.entries(locationCount)
      .map(([location, count]) => ({ location, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalApplications,
      responseRate,
      interviews,
      thisMonth,
      averageResponseTime: 7, // Can be calculated based on response dates
      topCompanies,
      applicationsByStatus,
      applicationsByMonth: [], // Can be implemented for trend analysis
      topLocations
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
