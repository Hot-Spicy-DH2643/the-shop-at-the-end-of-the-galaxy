import { queryResolvers } from './query.js';
import { mutationResolvers } from './mutation.js';

// Merge all resolvers
export const resolvers = {
  ...queryResolvers,
  ...mutationResolvers,
};
