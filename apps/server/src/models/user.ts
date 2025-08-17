import { model, Schema } from 'mongoose';

export interface Iuser {
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  firstName?: string;
  lastName?: string;
  socialLinks?: {
    website?: string;
    facebook?: string;
    x?: string;
  };
}

const userSchema = new Schema<Iuser>(
  {
    username: {
      type: String,
      required: [true, 'User name is req.'],
      maxlength: [20, 'username must be less than 20 characters'],
      unique: [true, 'username must be unique'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: [true, 'Email must be unique'],
      match: [
        /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
        'Please enter a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
      required: [true, 'Role is required'],
    },
    firstName: {
      type: String,
      maxlength: [30, 'First name must be less than 30 characters'],
    },
    lastName: {
      type: String,
      maxlength: [30, 'Last name must be less than 30 characters'],
    },
    socialLinks: {
      website: { type: String },
      facebook: { type: String },
      x: { type: String },
    },
  },
  {
    timestamps: true,
  }
);

export default model<Iuser>('User', userSchema);
