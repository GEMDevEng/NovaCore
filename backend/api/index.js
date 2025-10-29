/**
 * Vercel Serverless Function Handler
 * 
 * This file wraps the Express app to work as a Vercel serverless function.
 * It exports the app as a default export for Vercel's serverless environment.
 * 
 * The Express app is imported from ../src/index.js and handles all routing.
 */

import app from '../src/index.js';

/**
 * Export the Express app as the default handler for Vercel
 * Vercel will automatically route all requests to this handler
 */
export default app;

