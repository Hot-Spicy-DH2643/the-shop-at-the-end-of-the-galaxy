import { HttpLink } from '@apollo/client';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { SetContextLink } from '@apollo/client/link/context';

// Create HTTP link to your GraphQL endpoint
const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URI || 'http://localhost:4000/graphql',
});

// Auth link to add Firebase token to requests
const authLink = new SetContextLink(async (prevContext, operation) => {
  console.log('Setting auth context for operation:', operation.operationName);
  // Get the authentication token from Firebase
  const auth = await import('firebase/auth');
  const firebaseAuth = auth.getAuth();
  const user = firebaseAuth.currentUser;

  let token = null;
  if (user) {
    try {
      token = await user.getIdToken();
      console.log('Firebase token:', token);
    } catch (error) {
      console.error('Error getting Firebase token:', error);
    }
  }

  return {
    headers: {
      ...prevContext.headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// Create Apollo Client
const client = new ApolloClient({
  link: authLink.concat(httpLink),
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
