import { dirname } from 'path'; 
import { fileURLToPath } from 'url'; 
import dotenv from 'dotenv';
import express from 'express';
import db from './config/connection.js';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import jwt from 'jsonwebtoken';
import path from 'path';
import { authenticateToken, AuthenticationError } from './services/auth.js';
import { typeDefs, resolvers } from './schemas/index.js';

// Load environment variables from .env file
dotenv.config();

// Get the current file and directory name
const __filename = fileURLToPath(import.meta.url); 
const __dirname = dirname(__filename);

// Set the server port
const PORT = process.env.PORT || 3001;
const app = express();

// JWT secret key for authentication
const secret = process.env.JWT_SECRET || 'your_secret_key';

// Middleware function to authenticate requests using JWT

export const context = ({ req }: any) => {
  const token = req.headers.authorization?.split('Bearer ')[1] || null;
  console.log('Received Token:', token); // Debugging log

  if (!token) {
    throw new AuthenticationError('Missing token');
  }

  try {
    const user = jwt.verify(token, secret);
    console.log('Verified User:', user);
    return { user };
  } catch (err) {
    console.error('JWT Verification Error:', err);
    throw new AuthenticationError('Invalid token');
  }
};

// Initialize Apollo Server with type definitions and resolvers

const server = new ApolloServer({
  typeDefs, 
  resolvers,
});

// Function to start the Apollo server and database connection

const startApolloServer = async () => {
  await server.start(); // Start Apollo server
  await db(); // Establish database connection

  // Middleware to parse request bodies
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  // Attach Apollo GraphQL middleware with authentication context
  app.use('/graphql', expressMiddleware(server as any, { context: authenticateToken as any }));

  
  // Serve static files in production
  
  if (process.env.NODE_ENV === 'production') {
    console.log('Running in production mode');
    app.use(express.static(path.join(__dirname, '../../client/dist')));

    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
    });
  }

  // Start the Express server
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
  });
};

startApolloServer();
