'use client';

import { ApolloProvider } from '@apollo/client/react';
import { AuthInitializer } from '../components/AuthInitializer';
import DailyClaimChecker from '../components/dailyClaimChecker';
import apolloClient from '../lib/apollo-client';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ApolloProvider client={apolloClient}>
      <AuthInitializer>
        <DailyClaimChecker>{children}</DailyClaimChecker>
      </AuthInitializer>
    </ApolloProvider>
  );
}
