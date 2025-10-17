'use client';

import { useEffect } from 'react';

export default function CrashPage() {
  useEffect(() => {
    const error = new Error('[504] Gateway Timeout') as Error & {
      statusCode: number;
    };
    error.statusCode = 504;
    throw error;
  }, []);

  return <div>Loading...</div>;
}
