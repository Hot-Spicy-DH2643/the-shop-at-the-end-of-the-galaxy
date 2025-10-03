import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import { expressMiddleware } from '@apollo/server/express4';
import { verifyFirebaseToken } from '../middlewares/auth.js';

/**
 * Create and configure Express app
 * @returns {express.Application} Configured Express app
 */
export function createExpressApp() {
  const app = express();

  // Basic middleware
  app.use(logger('dev'));
  app.use(cookieParser());

  // Health check route
  app.get('/', (_req, res) => res.send('API is running'));

  return app;
}

/**
 * Setup GraphQL endpoint with Apollo Server
 * @param {express.Application} app - Express app instance
 * @param {ApolloServer} apolloServer - Apollo Server instance
 */
export async function setupGraphQL(app, apolloServer) {
  await apolloServer.start();

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
    expressMiddleware(apolloServer, {
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
