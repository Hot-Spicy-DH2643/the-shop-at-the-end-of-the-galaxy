import { queryResolvers } from './query.js';
import { mutationResolvers } from './mutation.js';
import { exampleResolvers } from './example.js';
import { asteroidResolvers } from './asteroid.js';
import { dailyClaimResolvers } from './dailyClaim.js';

export const resolvers = {
  ...exampleResolvers,
  ...queryResolvers,
  ...mutationResolvers,
  Query: {
    ...queryResolvers.Query,
    ...asteroidResolvers.Query,
    ...dailyClaimResolvers.Query,
  },
  Mutation: {
    ...mutationResolvers.Mutation,
    ...asteroidResolvers.Mutation,
    ...dailyClaimResolvers.Mutation,
  },
};
