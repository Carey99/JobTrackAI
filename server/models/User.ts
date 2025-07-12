import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  profileImageUrl: {
    type: String,
  },
}, {
  timestamps: true,
});

export default mongoose.model<IUser>('User', UserSchema);