import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Define the MongoDB connection URI, falling back to an empty string if not provided
const MONGODB_URI = process.env.MONGODB_URI || '';


// Establish a connection to the MongoDB database asynchronously

const db = async (): Promise<typeof mongoose.connection> => {
    try {
        // Connect to MongoDB using the connection URI
        await mongoose.connect(MONGODB_URI);
        
        // Log a success message if the connection is established
        console.log('Database connected.');

        // Return the active database connection
        return mongoose.connection;
    } catch (error) {
        // Log an error message if the connection fails
        console.error('Database connection error:', error);

        // Throw a new error indicating the failure
        throw new Error('Database connection failed.');
    }
};


export default db;
