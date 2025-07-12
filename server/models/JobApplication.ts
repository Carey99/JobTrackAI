import mongoose, { Schema, Document } from 'mongoose';

export interface IJobApplication extends Document {
  userId: string;
  company: string;
  position: string;
  location?: string;
  salaryRange?: string;
  status: string;
  applicationDate: Date;
  jobDescriptionUrl?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const JobApplicationSchema: Schema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  location: {
    type: String,
  },
  salaryRange: {
    type: String,
  },
  status: {
    type: String,
    required: true,
    default: 'Applied',
  },
  applicationDate: {
    type: Date,
    required: true,
  },
  jobDescriptionUrl: {
    type: String,
  },
  notes: {
    type: String,
  },
}, {
  timestamps: true,
});

export default mongoose.model<IJobApplication>('JobApplication', JobApplicationSchema);