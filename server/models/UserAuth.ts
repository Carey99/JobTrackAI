import mongoose from 'mongoose';

const userAuthSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  hashedPassword: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

export default mongoose.model('UserAuth', userAuthSchema);