import { queryResolvers } from './query.js';
import { mutationResolvers } from './mutation.js';
import { exampleResolvers } from './example.js';

// Merge all resolvers
export const resolvers = {
  ...exampleResolvers,
  ...queryResolvers,
  ...mutationResolvers,
};
