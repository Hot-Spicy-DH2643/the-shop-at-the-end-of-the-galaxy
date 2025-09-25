import { GraphQLString } from 'graphql';

export const protectedQuery = {
  protectedData: {
    type: GraphQLString,
    description: 'A protected query that requires authentication',
    resolve: (parent, args, context) => {
      // Check if user is authenticated
      if (!context.user) {
        throw new Error('Authentication required');
      }

      return `Hello ${context.user.email || context.user.uid}! This is protected data.`;
    },
  },
};
