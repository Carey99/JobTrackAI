import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertJobApplicationSchema, insertAIFeedbackSchema } from "@shared/schema";
import { generateAIFeedback } from "./openaiService";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Job applications routes
  app.get('/api/applications', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const applications = await storage.getUserJobApplications(userId);
      res.json(applications);
    } catch (error) {
      console.error("Error fetching applications:", error);
      res.status(500).json({ message: "Failed to fetch applications" });
    }
  });

  app.post('/api/applications', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertJobApplicationSchema.parse(req.body);
      const application = await storage.createJobApplication(userId, validatedData);
      res.status(201).json(application);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.toString() });
      }
      console.error("Error creating application:", error);
      res.status(500).json({ message: "Failed to create application" });
    }
  });

  app.put('/api/applications/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const applicationId = parseInt(req.params.id);
      const validatedData = insertJobApplicationSchema.partial().parse(req.body);
      
      const application = await storage.updateJobApplication(applicationId, userId, validatedData);
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
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

  app.delete('/api/applications/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const applicationId = parseInt(req.params.id);
      
      const success = await storage.deleteJobApplication(applicationId, userId);
      if (!success) {
        return res.status(404).json({ message: "Application not found" });
      }
      
      res.json({ message: "Application deleted successfully" });
    } catch (error) {
      console.error("Error deleting application:", error);
      res.status(500).json({ message: "Failed to delete application" });
    }
  });

  // AI feedback routes
  app.post('/api/ai-feedback', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { jobDescription, resume } = req.body;
      
      if (!jobDescription || !resume) {
        return res.status(400).json({ message: "Job description and resume are required" });
      }

      const aiResponse = await generateAIFeedback(jobDescription, resume);
      
      const feedbackData = {
        jobDescription,
        resume,
        matchScore: aiResponse.matchScore,
        strengths: aiResponse.strengths,
        improvements: aiResponse.improvements,
        recommendations: aiResponse.recommendations,
      };

      const feedback = await storage.createAIFeedback(userId, feedbackData);
      res.json(feedback);
    } catch (error) {
      console.error("Error generating AI feedback:", error);
      res.status(500).json({ message: "Failed to generate AI feedback" });
    }
  });

  app.get('/api/ai-feedback', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const feedback = await storage.getUserAIFeedback(userId);
      res.json(feedback);
    } catch (error) {
      console.error("Error fetching AI feedback:", error);
      res.status(500).json({ message: "Failed to fetch AI feedback" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
