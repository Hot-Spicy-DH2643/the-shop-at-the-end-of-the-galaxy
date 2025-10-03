'use client';

import { useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { useAuth } from '../../contexts/AuthContext';

const GET_PROTECTED_DATA = gql`
  query GetProtectedData {
    protectedData
  }
`;

interface ProtectedDataResult {
  protectedData: string;
}

export default function TestAuth() {
  const { user, loading: authLoading } = useAuth();
  const { data, loading, error } = useQuery<ProtectedDataResult>(
    GET_PROTECTED_DATA,
    {
      skip: authLoading, // Skip query if not authenticated
    }
  );

  if (authLoading) return <div>Checking authentication...</div>;
  // if (!user) return <div>Please log in to access this page.</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div>
          <h2 className="text-2xl font-bold text-center text-gray-900">
            Protected Data Test
          </h2>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium text-gray-700">User Info:</h3>
            <p className="text-sm text-gray-600">Email: {user?.email}</p>
            <p className="text-sm text-gray-600">UID: {user?.uid}</p>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-700">
              Protected Query Result:
            </h3>
            {loading && <p className="text-sm text-gray-600">Loading...</p>}
            {error && (
              <p className="text-sm text-red-600">Error: {error.message}</p>
            )}
            {data && (
              <p className="text-sm text-green-600">{data.protectedData}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
