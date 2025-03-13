import { ObjectId } from 'mongoose';
import User from '../models/User.js';
import { signToken, AuthenticationError } from '../services/auth.js';

// Interface for User Input in GraphQL Mutations

interface UserInput {
  id: ObjectId;
  username?: string;
  email: string;
  password: string;
}

// Interface for Book Input in GraphQL Mutations

interface BookInput {
  bookId: string;
  title: string;
  authors?: string[];
  description?: string;
  image?: string;
  link?: string;
}

// GraphQL Resolvers

const resolvers = {

  // Virtual Field Resolver: Calculates book count for a user
  
  User: {
    bookCount: (parent: { savedBooks: any[] }) => {
      return parent.savedBooks.length;
    },
  },

  // GraphQL Queries
  
  Query: {

    // Fetch the authenticated user's profile
    
    me: async (_parent: any, _args: any, context: any) => {
      console.log('Context:', context); // Debugging log

      // Ensure user is authenticated before proceeding
      if (!context.user) {
        throw new AuthenticationError('Could not authenticate user.');
      }

      // Find and return the user's details
      return User.findOne({ _id: context.user._id });
    },
  },

  // GraphQL Mutations

  Mutation: {
    
    // Create a new user and return an authentication token
    
    addUser: async (_: any, { input }: { input: UserInput }) => {
      const user = await User.create(input);

      if (!user) {
        throw new Error('Error while creating user');
      }

      // Generate JWT token
      const token = signToken(user._id as string, user.username as string, user.email as string);
      return { token, user };
    },

    // Authenticate user login and return an authentication token
    
    login: async (_: any, { input }: { input: UserInput }) => {
      console.log(input); // Debugging log

      // Find user by email
      const user = await User.findOne({ email: input.email });

      if (!user) {
        throw new Error("Can't find this user.");
      }

      // Verify password
      const correctPw = await user.isCorrectPassword(input.password);
      if (!correctPw) {
        throw new Error('Wrong password!');
      }

      // Generate JWT token
      const token = signToken(user._id as string, user.username as string, user.email as string);
      return { token, user };
    },

    // Save a book to the user's savedBooks list
    
    saveBook: async (_: any, { book }: { book: BookInput }, context: any) => {
      // Ensure user is authenticated before saving a book
      if (!context.user) {
        throw new AuthenticationError('Could not authenticate user.');
      }

      // Add the book to the user's savedBooks list
      const updatedUser = await User.findOneAndUpdate(
        { _id: context.user._id },
        { $addToSet: { savedBooks: book } },
        { new: true, runValidators: true }
      );

      return updatedUser;
    },

    // Remove a book from the user's savedBooks list
    
    removeBook: async (_: any, { bookId }: { bookId: BookInput }, context: any) => {
      // Remove the book from the user's savedBooks list
      const updatedUser = await User.findOneAndUpdate(
        { _id: context.user._id },
        { $pull: { savedBooks: { bookId } } },
        { new: true }
      );

      if (!updatedUser) {
        throw new Error("Couldn't find user or error deleting book");
      }

      return updatedUser;
    },
  },
};

export default resolvers;
