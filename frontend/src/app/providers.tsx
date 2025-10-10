'use client';

import { ApolloProvider } from '@apollo/client/react';
import { AuthInitializer } from '../components/AuthInitializer';
import apolloClient from '../lib/apollo-client';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ApolloProvider client={apolloClient}>
      <AuthInitializer>{children}</AuthInitializer>
    </ApolloProvider>
  );
}
