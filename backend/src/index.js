#!/usr/bin/env node

/**
 * Module dependencies.
 */

// NOTE: With ES modules, all imports are hoisted. To ensure .env is loaded before other modules,
// we need to load dotenv configuration before importing anything that uses env variables.
// This is done by importing a config file first.
import './config/dotenv.js';
import { createApolloServer } from './loaders/apollo.js';
import { createExpressApp, setupGraphQL } from './loaders/express.js';
import { connectDatabase } from './loaders/database.js';
import { initializeCronJobs } from './utils/cronJobs.js';
import { asteroidViewersService } from './services/asteroidViewersService.js';
import http from 'http';

// Create Apollo Server and Express app
const server = createApolloServer();
const app = createExpressApp();

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || '3001');
app.set('port', port);

/**
 * Create HTTP server.
 */

const httpServer = http.createServer(app);

/**
 * Function to start the server
 */
async function startServer() {
  // Connect to database
  await connectDatabase();

  // Initialize cron jobs for daily asteroid cache
  initializeCronJobs();

  await setupGraphQL(app, server);

  // Initialize WebSocket server for real-time asteroid viewers
  asteroidViewersService.initialize(httpServer);

  /**
   * Listen on provided port, on all network interfaces.
   */
  httpServer.listen(port);
  httpServer.on('error', onError);
  httpServer.on('listening', onListening);
}

// Start the server
startServer().catch(error => {
  console.error('Failed to start Apollo Server:', error);
});

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr = httpServer.address();
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  console.log('🚀 Server listening on ' + bind);
}
