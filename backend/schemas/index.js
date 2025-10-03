import { GraphQLObjectType, GraphQLSchema } from 'graphql';
import { helloQuery } from './features/hello.js';
import { protectedQuery } from './features/protected.js';

// Root Query - combines all feature queries
const RootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  description: 'Root query for the application',
  fields: () => ({
    ...helloQuery,
    ...protectedQuery,
    // Todo queries
    // ...todoQueries,
    // User queries
    // ...userQueries,
    // Add more feature queries here as you expand
    // ...notificationQueries,
    // ...authQueries,
  }),
});

// Root Mutation - combines all feature mutations
const RootMutation = new GraphQLObjectType({
  name: 'RootMutation',
  description: 'Root mutation for the application',
  fields: () => ({
    // Todo mutations
    // ...todoMutations,
    // User mutations
    // ...userMutations,
    // Add more feature mutations here as you expand
    // ...notificationMutations,
    // ...authMutations,
  }),
});

// Combined Schema
export default new GraphQLSchema({
  query: RootQuery,
  // mutation: RootMutation,
});
