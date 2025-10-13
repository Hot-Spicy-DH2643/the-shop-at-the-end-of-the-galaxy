// export default function CrashPage() {
//   throw new Error('This is a simulated server crash (500 error)');
// }

export default function CrashPage() {
  const error = new Error('[504] Gateway Timeout') as Error & {
    statusCode: number;
  };
  error.statusCode = 504;
  throw error;
}
