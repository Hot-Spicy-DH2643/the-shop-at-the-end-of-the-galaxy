import { ApolloServer } from '@apollo/server';
import { typeDefs } from '../graphql/typeDefs/index.js';
import { resolvers } from '../graphql/resolvers/index.js';

/**
 * Create and configure Apollo Server instance
 * @returns {ApolloServer} Configured Apollo Server instance
 */
export function createApolloServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    formatError: err => {
      console.error('GraphQL Error:', err);
      return {
        message: err.message,
        locations: err.locations,
        path: err.path,
      };
    },
  });

  return server;
}
