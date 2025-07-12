import mongoose, { Schema, Document } from 'mongoose';

export interface IAIFeedback extends Document {
  userId: string;
  jobDescription: string;
  resume: string;
  matchScore?: string;
  strengths?: string;
  improvements?: string;
  recommendations?: string;
  createdAt: Date;
}

const AIFeedbackSchema: Schema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  jobDescription: {
    type: String,
    required: true,
  },
  resume: {
    type: String,
    required: true,
  },
  matchScore: {
    type: String,
  },
  strengths: {
    type: String,
  },
  improvements: {
    type: String,
  },
  recommendations: {
    type: String,
  },
}, {
  timestamps: true,
});

export default mongoose.model<IAIFeedback>('AIFeedback', AIFeedbackSchema);