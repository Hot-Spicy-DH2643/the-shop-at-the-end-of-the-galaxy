import express from 'express';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import logger from 'morgan';
import cors from 'cors';
import { expressMiddleware } from '@apollo/server/express4';
import {
  verifySession,
  loginHandler,
  logoutHandler,
} from '../middlewares/auth.js';

/**
 * Create and configure Express app
 * @returns {express.Application} Configured Express app
 */
export function createExpressApp() {
  const app = express();

  // Trust proxy for secure cookies behind reverse proxy (Cloudflare)
  app.set('trust proxy', 1);

  // Basic middleware
  app.use(logger('dev'));
  app.use(cookieParser());
  app.use(express.json());

  // Session configuration
  app.use(
    session({
      name: 'galaxy.shop.sid', // Custom cookie name
      secret:
        process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Allow cross-site cookies in production
      },
    })
  );

  // CORS configuration for credentials
  const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true, // Allow cookies to be sent
  };

  app.use(cors(corsOptions));

  // Health check route
  app.get('/', (_req, res) => res.send('API is running'));

  // Authentication routes
  app.post('/auth/login', loginHandler);
  app.post('/auth/logout', logoutHandler);

  return app;
}

/**
 * Setup GraphQL endpoint with Apollo Server
 * @param {express.Application} app - Express app instance
 * @param {ApolloServer} apolloServer - Apollo Server instance
 */
export async function setupGraphQL(app, apolloServer) {
  await apolloServer.start();

  // CORS options for GraphQL endpoint
  const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true, // Allow cookies to be sent
  };

  app.use(
    '/graphql',
    cors(corsOptions),
    // GraphQL log middleware
    (req, res, next) => {
      console.log('\n🔵 [BACKEND] GraphQL Request received:');
      console.log('  Method:', req.method);
      console.log('  Timestamp:', new Date().toISOString());
      console.log('  Session ID:', req.session?.id);
      console.log('  User:', req.session?.user?.email || 'No user in session');
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
          // Now verify session instead of Firebase token
          const { user } = await verifySession(req);
          return { user };
        } catch (error) {
          console.error('Auth error:', error);
          return { user: null };
        }
      },
    })
  );
}
