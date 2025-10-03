import { HttpLink } from '@apollo/client';
import { ApolloClient, InMemoryCache } from '@apollo/client';

// Create HTTP link to your GraphQL endpoint with credentials
const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URI || 'http://localhost:3001/graphql',
  credentials: 'include', // Include cookies in requests
});

// Create Apollo Client - no auth link needed as we use session cookies
const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'ignore',
    },
    query: {
      errorPolicy: 'all',
    },
  },
});

export default client;
