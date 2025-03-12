import jwt from 'jsonwebtoken';
import { GraphQLError } from 'graphql';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Middleware function to authenticate a JWT token

export const authenticateToken = ({ req }: any) => {
  let token = req.headers.authorization;

  console.log(token);
  if (req.headers.authorization) {
    token = token.split(' ').pop().trim();
  }

  if (!token) {
    return req;
  }

  try {
    const { data }: any = jwt.verify(token, process.env.JWT_SECRET_KEY || '', { maxAge: '2hr' });

    req.user = data;
  } catch (err) {
    console.log('Invalid token'); 
  }

  return req; 
};

// Function to generate a JWT token

export const signToken = (_id: string, username: string, email: string) => {
  const payload = { _id, username, email }; 
  const secretKey: any = process.env.JWT_SECRET_KEY; 
  
  return jwt.sign({ data: payload }, secretKey, { expiresIn: '2h' });
};

// Custom error class for authentication errors

export class AuthenticationError extends GraphQLError {
  constructor(message: string) {
    super(message, undefined, undefined, undefined, ['UNAUTHENTICATED']);
    Object.defineProperty(this, 'name', { value: 'AuthenticationError' });
  }
};
