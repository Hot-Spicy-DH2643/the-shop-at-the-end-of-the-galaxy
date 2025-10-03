import admin from 'firebase-admin';

// Initialize Firebase Admin
if (!admin.apps.length) {
  // Debug: Log environment variables (remove in production)
  console.log('🔧 Firebase Environment Variables:');
  console.log('PROJECT_ID:', process.env.FIREBASE_PROJECT_ID);
  console.log('CLIENT_EMAIL:', process.env.FIREBASE_CLIENT_EMAIL);
  console.log(
    'PRIVATE_KEY_ID:',
    process.env.FIREBASE_PRIVATE_KEY_ID?.substring(0, 10) + '...'
  );
  console.log('PRIVATE_KEY exists:', !!process.env.FIREBASE_PRIVATE_KEY);

  // Check if required environment variables are present
  if (
    !process.env.FIREBASE_PROJECT_ID ||
    !process.env.FIREBASE_PRIVATE_KEY ||
    !process.env.FIREBASE_CLIENT_EMAIL
  ) {
    throw new Error(
      'Missing required Firebase environment variables. Please check your .env file.'
    );
  }

  const serviceAccount = {
    type: 'service_account',
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.FIREBASE_CLIENT_EMAIL}`,
  };

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: process.env.FIREBASE_PROJECT_ID,
  });

  console.log('✅ Firebase Admin initialized successfully');
}

export const verifyFirebaseToken = async req => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return { user: null, error: 'No token provided' };
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    return { user: decodedToken, error: null };
  } catch (error) {
    console.error('Token verification failed:', error);
    return { user: null, error: 'Invalid token' };
  }
};
