import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  date,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Job applications table
export const jobApplications = pgTable("job_applications", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  company: varchar("company").notNull(),
  position: varchar("position").notNull(),
  location: varchar("location"),
  salaryRange: varchar("salary_range"),
  status: varchar("status").notNull().default("Applied"),
  applicationDate: date("application_date").notNull(),
  jobDescriptionUrl: varchar("job_description_url"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertJobApplicationSchema = createInsertSchema(jobApplications).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertJobApplication = z.infer<typeof insertJobApplicationSchema>;
export type JobApplication = typeof jobApplications.$inferSelect;

// AI feedback table
export const aiFeedback = pgTable("ai_feedback", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  jobDescription: text("job_description").notNull(),
  resume: text("resume").notNull(),
  matchScore: varchar("match_score"),
  strengths: text("strengths"),
  improvements: text("improvements"),
  recommendations: text("recommendations"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertAIFeedbackSchema = createInsertSchema(aiFeedback).omit({
  id: true,
  userId: true,
  createdAt: true,
});

export type InsertAIFeedback = z.infer<typeof insertAIFeedbackSchema>;
export type AIFeedback = typeof aiFeedback.$inferSelect;
