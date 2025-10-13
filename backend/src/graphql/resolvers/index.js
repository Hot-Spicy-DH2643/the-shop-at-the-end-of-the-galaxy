import { queryResolvers } from './query.js';
import { mutationResolvers } from './mutation.js';
import { exampleResolvers } from './example.js';
import { asteroidResolvers } from './asteroid.js';
import { userResolvers } from './user.js';

// Merge all resolvers
export const resolvers = {
  ...exampleResolvers,
  ...queryResolvers,
  ...mutationResolvers,
  ...userResolvers,
  Query: {
    ...queryResolvers.Query,
    ...asteroidResolvers.Query,
    ...userResolvers.Query,
  },
  Mutation: {
    ...mutationResolvers.Mutation,
    ...asteroidResolvers.Mutation,
  },
};
