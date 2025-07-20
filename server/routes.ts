import { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertJobApplicationSchema, insertAIFeedbackSchema } from "@shared/schema";
import { generateAIFeedback } from "./openaiService";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret-for-development';

// User profile schema for validation
const userProfileSchema = z.object({
  // Personal Information
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  linkedinUrl: z.string().url().optional().or(z.literal("")),
  portfolioUrl: z.string().url().optional().or(z.literal("")),
  
  // Professional Information
  currentTitle: z.string().optional(),
  yearsOfExperience: z.string().optional(),
  targetSalary: z.string().optional(),
  availabilityDate: z.string().optional(),
  workLocation: z.string().optional(),
  
  // Education
  highestEducation: z.string().optional(),
  fieldOfStudy: z.string().optional(),
  university: z.string().optional(),
  graduationYear: z.string().optional(),
  
  // Skills & Bio
  skills: z.string().optional(),
  bio: z.string().optional(),
  careerObjective: z.string().optional()
});

// Middleware to get current user ID from token
const getCurrentUserId = (req: any): string | null => {
  try {
    const token = req.cookies.auth_token;
    if (!token) return null;
    
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return decoded.userId;
  } catch {
    return null;
  }
};

export async function registerRoutes(app: Express): Promise<void> {
  
  // ===== AUTHENTICATION ROUTES =====
  
  app.post('/api/auth/signup', async (req, res) => {
    console.log('🔐 Signup attempt:', { email: req.body.email, firstName: req.body.firstName });
    
    try {
      const { firstName, lastName, email, password } = req.body;

      // Validate input
      if (!firstName || !lastName || !email || !password) {
        console.log('❌ Signup failed: Missing required fields');
        return res.status(400).json({ message: 'All fields are required' });
      }

      if (password.length < 6) {
        console.log('❌ Signup failed: Password too short');
        return res.status(400).json({ message: 'Password must be at least 6 characters long' });
      }

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        console.log('❌ Signup failed: User already exists');
        return res.status(400).json({ message: 'User with this email already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create user ID
      const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      console.log('✅ Creating user with ID:', userId);

      // Create user
      const user = await storage.upsertUser({
        id: userId,
        email,
        firstName,
        lastName,
        profileImageUrl: null,
      });

      // Store authentication data
      await storage.createUserAuth(userId, email, hashedPassword);

      // Generate JWT token
      const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: '7d',
      });

      // Set cookie and return user data
      res.cookie('auth_token', token, {
        httpOnly: true,
        secure: false, // Set to false for local development without HTTPS
        sameSite: 'lax',
        path: '/', // Explicitly set the path
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      console.log('✅ User created successfully:', user.id);

      res.status(201).json({
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
        message: 'Account created successfully',
      });
    } catch (error) {
      console.error('❌ Signup error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    console.log('🔐 Login attempt:', { email: req.body.email });
    
    try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }

      // Get user authentication data
      const userAuth = await storage.getUserAuth(email);
      if (!userAuth) {
        console.log('❌ Login failed: User not found');
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      // Verify passwford
      const isPasswordValid = await bcrypt.compare(password, userAuth.hashedPassword);
      if (!isPasswordValid) {
        console.log('❌ Login failed: Invalid password');
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      // Get user data
      const user = await storage.getUser(userAuth.userId);
      if (!user) {
        console.log('❌ Login failed: User data not found');
        return res.status(401).json({ message: 'User not found' });
      }

      // Generate JWT token
      const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: '7d',
      });

      // Set cookie and return user data
      res.cookie('auth_token', token, {
        httpOnly: true,
        secure: false, // Set to false for local development without HTTPS
        sameSite: 'lax',
        path: '/', // Explicitly set the path
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      console.log('✅ Login successful:', user.id);

      res.json({
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
        message: 'Logged in successfully',
      });
    } catch (error) {
      console.error('❌ Login error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.get('/api/auth/user', async (req, res) => {
    try {
      const userId = getCurrentUserId(req);
      
      if (!userId) {
        return res.status(401).json({ message: 'Not authenticated' });
      }

      const user = await storage.getUser(userId);

      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      res.json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      });
    } catch (error) {
      console.error('Auth check error:', error);
      res.status(401).json({ message: 'Invalid token' });
    }
  });

  app.post('/api/auth/signout', async (req, res) => {
    res.clearCookie('auth_token');
    res.json({ message: 'Signed out successfully' });
  });

  // ===== USER PROFILE ROUTES =====
  
  app.get('/api/profile', async (req, res) => {
    try {
      const userId = getCurrentUserId(req);
      if (!userId) {
        return res.status(401).json({ message: 'Not authenticated' });
      }
      
      const profile = await storage.getUserProfile(userId);
      res.json(profile);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ message: "Failed to fetch user profile" });
    }
  });

  app.put('/api/profile', async (req, res) => {
    try {
      const userId = getCurrentUserId(req);
      if (!userId) {
        return res.status(401).json({ message: 'Not authenticated' });
      }
      
      const validatedData = userProfileSchema.parse(req.body);
      const profile = await storage.updateUserProfile(userId, validatedData);
      res.json(profile);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.toString() });
      }
      console.error("Error updating user profile:", error);
      res.status(500).json({ message: "Failed to update user profile" });
    }
  });

  // ===== JOB APPLICATION ROUTES =====
  
  app.get('/api/applications', async (req, res) => {
    try {
      const userId = getCurrentUserId(req);
      if (!userId) {
        return res.status(401).json({ message: 'Not authenticated' });
      }
      
      const applications = await storage.getUserJobApplications(userId);
      res.json(applications);
    } catch (error) {
      console.error("Error fetching applications:", error);
      res.status(500).json({ message: "Failed to fetch applications" });
    }
  });

  app.post('/api/applications', async (req, res) => {
    try {
      const userId = getCurrentUserId(req);
      console.log('Creating application, auth status:', !!userId);
      
      // If this logs null, your auth isn't working
      if (!userId) {
        return res.status(401).json({ message: 'Not authenticated' });
      }
      
      // Log the validated data
      const validatedData = insertJobApplicationSchema.parse(req.body);
      console.log('Saving application data:', validatedData);
      
      const application = await storage.createJobApplication(userId, validatedData);
      console.log('Application saved with ID:', application.id);
      
      res.status(201).json(application);
    } catch (error) {
      console.error("Error creating application:", error);
      // More error handling...
    }
  });

  // Add missing routes for complete CRUD operations
  app.put('/api/applications/:id', async (req, res) => {
    try {
      const userId = getCurrentUserId(req);
      if (!userId) {
        return res.status(401).json({ message: 'Not authenticated' });
      }
      
      const { id } = req.params;
      const validatedData = insertJobApplicationSchema.partial().parse(req.body);
      const application = await storage.updateJobApplication(id, userId, validatedData);
      
      if (!application) {
        return res.status(404).json({ message: 'Application not found' });
      }
      
      res.json(application);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.toString() });
      }
      console.error("Error updating application:", error);
      res.status(500).json({ message: "Failed to update application" });
    }
  });

  app.delete('/api/applications/:id', async (req, res) => {
    try {
      const userId = getCurrentUserId(req);
      if (!userId) {
        return res.status(401).json({ message: 'Not authenticated' });
      }
      
      const { id } = req.params;
      const deleted = await storage.deleteJobApplication(id, userId);
      
      if (!deleted) {
        return res.status(404).json({ message: 'Application not found' });
      }
      
      res.json({ message: 'Application deleted successfully' });
    } catch (error) {
      console.error("Error deleting application:", error);
      res.status(500).json({ message: "Failed to delete application" });
    }
  });

  // ===== AI FEEDBACK ROUTES =====
  
  app.post('/api/ai-feedback', async (req, res) => {
    try {
      const userId = getCurrentUserId(req);
      if (!userId) {
        return res.status(401).json({ message: 'Not authenticated' });
      }
      
      const validatedData = insertAIFeedbackSchema.parse(req.body);
      
      // Generate AI feedback
      const aiResponse = await generateAIFeedback(
        validatedData.jobDescription,
        validatedData.resume
      );
      
      // Store the feedback
      const feedback = await storage.createAIFeedback(userId, {
        ...validatedData,
        ...aiResponse,
      });
      
      res.status(201).json(feedback);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.toString() });
      }
      console.error("Error creating AI feedback:", error);
      res.status(500).json({ message: "Failed to generate AI feedback" });
    }
  });

  app.get('/api/ai-feedback', async (req, res) => {
    try {
      const userId = getCurrentUserId(req);
      if (!userId) {
        return res.status(401).json({ message: 'Not authenticated' });
      }
      
      const feedback = await storage.getUserAIFeedback(userId);
      res.json(feedback);
    } catch (error) {
      console.error("Error fetching AI feedback:", error);
      res.status(500).json({ message: "Failed to fetch AI feedback" });
    }
  });

  // ===== ANALYTICS ROUTES =====
  
  app.get('/api/analytics', async (req, res) => {
    try {
      const userId = getCurrentUserId(req);
      if (!userId) {
        return res.status(401).json({ message: 'Not authenticated' });
      }
      
      const { timeRange = 'all' } = req.query;
      const analytics = await storage.getUserAnalytics(userId, timeRange as string);
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });
}
