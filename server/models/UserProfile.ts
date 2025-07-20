import mongoose from 'mongoose';

const userProfileSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  // Personal Information
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  location: String,
  linkedinUrl: String,
  portfolioUrl: String,
  
  // Professional Information
  currentTitle: String,
  yearsOfExperience: String,
  targetSalary: String,
  availabilityDate: String,
  workLocation: String,
  
  // Education
  highestEducation: String,
  fieldOfStudy: String,
  university: String,
  graduationYear: String,
  
  // Skills & Bio
  skills: String,
  bio: String,
  careerObjective: String,
}, {
  timestamps: true,
});

export default mongoose.model('UserProfile', userProfileSchema);