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

