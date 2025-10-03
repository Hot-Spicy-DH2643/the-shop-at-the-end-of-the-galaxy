import createError from 'http-errors';
import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import mongoose from 'mongoose';
import schema from './schemas/apollo-schema.js';
import cors from 'cors';
import { verifyFirebaseToken } from './middleware/auth.js';

import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';

// Create Apollo Server
const server = new ApolloServer({
  typeDefs: schema.typeDefs,
  resolvers: schema.resolvers,
  formatError: (err) => {
    console.error('GraphQL Error:', err);
    return {
      message: err.message,
      locations: err.locations,
      path: err.path,
    };
  },
});

const app = express();

// Basic middleware
app.use(logger('dev'));
app.use(cookieParser());

app.get('/', (_req, res) => res.send('API is running'));

// Function to start the server
async function startServer() {
  await server.start();
  
  app.use(
    '/graphql',
    cors(),
    express.json(),
    // GraphQL log middleware
    (req, res, next) => {
      console.log('\n🔵 [BACKEND] GraphQL Request received:');
      console.log('  Method:', req.method);
      console.log('  Timestamp:', new Date().toISOString());
      if (req.body && req.body.query) {
        console.log(
          '  Query/Mutation:',
          req.body.query.replace(/\s+/g, ' ').trim()
        );
        if (req.body.variables) {
          console.log('  Variables:', JSON.stringify(req.body.variables));
        }
      }
      next();
    },
    expressMiddleware(server, {
      context: async ({ req }) => {
        try {
          const { user } = await verifyFirebaseToken(req);
          return { user };
        } catch (error) {
          console.error('Auth error:', error);
          return { user: null };
        }
      },
    })
  );
}

// Start the server
startServer().catch(error => {
  console.error('Failed to start Apollo Server:', error);
});

export default app;
