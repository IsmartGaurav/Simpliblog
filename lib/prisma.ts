import { PrismaClient } from "@prisma/client";
import { Pool } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';

declare global {
  var prisma: PrismaClient | undefined;
}

// SECURITY: Don't log the full connection string as it contains credentials
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

// Create connection pool with security-focused configuration
const pool = new Pool({ 
  connectionString,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

// Use a more secure error handler that doesn't expose connection details
pool.on('error', (err) => {
  // Avoid logging the full error object as it may contain connection details
  console.error('Database pool error occurred');
  // Don't exit process in Edge Runtime
});

// Set up adapter with the improved pool
const adapter = new PrismaNeon(pool);

// Create Prisma client with adapter and minimal logging
export const prisma = global.prisma || 
  new PrismaClient({
    adapter,
    // Only log true errors, not warnings which might contain sensitive data
    log: process.env.NODE_ENV === 'development' ? ['error'] : [],
  });

// Simplified connection handling without detailed logging
prisma.$connect()
  .then(() => {
    // Don't log any connection details
    if (process.env.NODE_ENV === 'development') {
      console.log('Database connected');
    }
  })
  .catch(() => {
    console.error('Database connection failed');
    // Don't log the error object as it may contain the connection string
  });

// Note: We can't use process.on in Edge Runtime
// Instead, rely on Prisma and Neon's built-in connection management

if (process.env.NODE_ENV !== "production") global.prisma = prisma;