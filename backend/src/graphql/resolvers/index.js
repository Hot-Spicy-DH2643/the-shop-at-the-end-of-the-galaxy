import { queryResolvers } from './query.js';
import { mutationResolvers } from './mutation.js';
import { exampleResolvers } from './example.js';
import { asteroidResolvers } from './asteroid.js';

// Merge all resolvers
export const resolvers = {
  ...exampleResolvers,
  ...queryResolvers,
  ...mutationResolvers,
  Query: {
    ...queryResolvers.Query,
    ...asteroidResolvers.Query,
  },
  Mutation: {
    ...mutationResolvers.Mutation,
    ...asteroidResolvers.Mutation,
  },
};
