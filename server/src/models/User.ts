import { type Document } from 'mongoose';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

// Import the schema from Book.js to store saved books
import bookSchema from './Book.js';
import type { BookDocument } from './Book.js';

// Defines the UserDocument interface for type safety

export interface UserDocument extends Document {
  id: mongoose.Types.ObjectId; 
  username: string; 
  email: string;
  password: string; 
  savedBooks: BookDocument[]; 
  isCorrectPassword(password: string): Promise<boolean>; 
  bookCount: number; 
}

// Defines the User schema for MongoDB

const userSchema = new mongoose.Schema<UserDocument>(
  {
    // Stores the username, must be unique
    username: {
      type: String,
      required: true,
      unique: true,
    },

    // Stores the user's email, must be unique and match a valid email format
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, 'Must use a valid email address'],
    },

    // Stores the hashed password
    password: {
      type: String,
      required: true,
    },

    // Stores an array of saved books, following the bookSchema structure
    savedBooks: [bookSchema],
  },
  {
    toJSON: {
      virtuals: true, // Enables virtual fields to be included in JSON responses
    },
  }
);

// Middleware to hash the user's password before saving it to the database

userSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
    const saltRounds = 10; 
    this.password = await bcrypt.hash(this.password, saltRounds); 
  }

  next(); 
});

// Custom method to validate password during login

userSchema.methods.isCorrectPassword = async function (password: string) {
  return await bcrypt.compare(password, this.password); 
};

// Virtual property `bookCount` to get the number of saved books

userSchema.virtual('bookCount').get(function () {
  return this.savedBooks.length; 
});

// Initializes and exports the User model

const User = mongoose.model<UserDocument>('User', userSchema);

export default User;
