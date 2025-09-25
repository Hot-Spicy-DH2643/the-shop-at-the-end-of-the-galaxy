import createError from 'http-errors';
import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import { graphqlHTTP } from 'express-graphql';
import mongoose from 'mongoose';
import schema from './schemas/index.js';

import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// GraphQL log middleware
app.use('/graphql', (req, res, next) => {
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
});

app.get('/', (_req, res) => res.send('API is running'));

app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);

export default app;
