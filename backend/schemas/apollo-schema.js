import gql from 'graphql-tag';

// Type definitions using Schema Definition Language (SDL)
export const typeDefs = gql`
  type Query {
    hello: String!
    protectedData: String!
  }

  type Mutation {
    # Add mutations here as needed
    placeholder: String
  }
`;

// Resolvers
export const resolvers = {
  Query: {
    hello: () => 'Hello, world!',
    protectedData: (parent, args, context) => {
      // Check if user is authenticated
      if (!context.user) {
        throw new Error('Authentication required');
      }

      return `Hello ${context.user.email || context.user.uid}! This is protected data.`;
    },
  },

  Mutation: {
    // Add mutation resolvers here as needed
    placeholder: () => 'This is a placeholder mutation',
  },
};

// Export the schema in Apollo Server format
export default {
  typeDefs,
  resolvers,
};
