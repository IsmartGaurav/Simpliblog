import { PrismaClient } from "@prisma/client";
import { Pool } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';

declare global {
  var prisma: PrismaClient | undefined;
}

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

// Create connection pool with better configuration
const pool = new Pool({ 
  connectionString,
  max: 10, // Maximum number of connections
  idleTimeoutMillis: 30000, // How long a connection can be idle before being closed
  connectionTimeoutMillis: 5000, // How long to wait for a connection
});

// Add event listeners for connection issues
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  // Don't exit process in Edge Runtime
  // process.exit(-1);
});

// Set up adapter with the improved pool
const adapter = new PrismaNeon(pool);

// Create Prisma client with adapter and better logging
export const prisma = global.prisma || 
  new PrismaClient({
    adapter,
    log: ['error', 'warn'],
  });

// Add connection handling
prisma.$connect()
  .then(() => {
    console.log('Successfully connected to the database');
  })
  .catch((e) => {
    console.error('Failed to connect to the database', e);
  });

// Note: We can't use process.on in Edge Runtime
// Instead, rely on Prisma and Neon's built-in connection management

if (process.env.NODE_ENV !== "production") global.prisma = prisma;