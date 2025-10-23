import admin from 'firebase-admin';
import { User } from '../models/User.js';

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

/**
 * Verify session from cookie
 * Used for GraphQL requests after initial login
 */
export const verifySession = async req => {
  // Check if session exists and has user data
  if (req.session && req.session.user) {
    return { user: req.session.user, error: null };
  }

  return { user: null, error: 'No valid session' };
};

/**
 * Login endpoint handler - verifies Firebase token and creates session
 * Also creates a new user in the database if this is their first login
 */
export const loginHandler = async (req, res) => {
  try {
    const { user, error } = await verifyFirebaseToken(req);

    console.log('🔐 Login attempt for UID:', user ? user.uid : 'N/A');

    if (error || !user) {
      return res.status(401).json({ error: error || 'Authentication failed' });
    }

    let resolvedDisplayName =
      (typeof user.name === 'string' && user.name.trim()) || '';

    if (!resolvedDisplayName) {
      try {
        const userRecord = await admin.auth().getUser(user.uid);
        resolvedDisplayName = userRecord.displayName?.trim() || '';
      } catch (lookupError) {
        console.error(
          'Unable to fetch Firebase user record for display name:',
          lookupError
        );
      }
    }

    const effectiveName = resolvedDisplayName || 'Unnamed User';

    console.log('🔐 Login attempt for name:', effectiveName);

    // Check if user exists in database, create if not
    try {
      let dbUser = await User.findOne({ uid: user.uid });

      if (!dbUser) {
        // First time user - create new user in database
        dbUser = new User({
          uid: user.uid,
          name: effectiveName,
          // All other fields will use their default values from the schema
        });

        await dbUser.save();
        console.log('✅ New user created in database:', user.uid);
      } else {
        if (effectiveName && dbUser.name !== effectiveName) {
          dbUser.name = effectiveName;
          await dbUser.save();
          console.log('🔄 User name updated in database:', user.uid);
        } else {
          console.log('👤 Existing user logged in:', user.uid);
        }
      }
    } catch (dbError) {
      console.error('Database error during user creation/lookup:', dbError);
      // Continue with login even if database operation fails
      // This prevents auth from breaking if DB is temporarily unavailable
    }

    // Store user data in session
    req.session.user = {
      uid: user.uid,
      email: user.email,
      name: effectiveName,
      picture: user.picture,
      email_verified: user.email_verified,
    };

    // Save session explicitly
    req.session.save(err => {
      if (err) {
        console.error('Session save error:', err);
        return res.status(500).json({ error: 'Failed to create session' });
      }

      console.log('✅ Session created for user:', user.uid);
      res.json({
        success: true,
        user: req.session.user,
      });
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Logout endpoint handler - destroys session
 */
export const logoutHandler = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Session destroy error:', err);
      return res.status(500).json({ error: 'Failed to logout' });
    }

    res.clearCookie('galaxy.shop.sid'); // Clear session cookie with custom name
    console.log('✅ Session destroyed');
    res.json({ success: true, message: 'Logged out successfully' });
  });
};
