export const queryResolvers = {
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
};
