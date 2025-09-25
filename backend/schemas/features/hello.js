import { GraphQLString } from 'graphql';

export const helloQuery = {
  hello: {
    type: GraphQLString,
    description: 'A simple hello world query',
    resolve: () => 'Hello, world!',
  },
};
