'use client';

import { useState } from 'react';
import { useAuthStore } from '../../store/useAuthViewModel';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const {
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    getIdToken,
    loading,
  } = useAuthStore();
  const router = useRouter();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isSignUp) {
        // Sign-up validation
        if (!username.trim()) {
          setError('Please enter a username');
          return;
        }
        if (username.length < 3) {
          setError('Username must be at least 3 characters long');
          return;
        }
        if (password.length < 6) {
          setError('Password must be at least 6 characters long');
          return;
        }
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          return;
        }

        await signUpWithEmail(email, password, username);
        console.log('Sign up successful');
      } else {
        await signInWithEmail(email, password);
        console.log('Email login successful');
      }
      router.push('/'); // Redirect to dashboard after successful login/signup
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : isSignUp
            ? 'Failed to sign up. Please try again.'
            : 'Failed to sign in. Please check your credentials.';
      setError(errorMessage);
      console.error(isSignUp ? 'Sign up error:' : 'Login error:', err);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');

    try {
      await signInWithGoogle();
      console.log('Google login successful');
      // print the token to the console
      const token = await getIdToken();
      console.log('Firebase ID Token:', token);
      router.push('/'); // Redirect to dashboard after successful login
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to sign in with Google.';
      setError(errorMessage);
      console.error('Google login error:', err);
    }
  };

  return (
    <div className="galaxy-bg-space min-h-screen w-full flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-white text-left mb-4 w-full max-w-xl pl-4 sm:pl-8">
        <Link
          href="/"
          className="block px-4 py-2 relative transition-all duration-500
    before:content-[''] before:absolute before:left-0 before:bottom-1 before:w-0 before:h-0.5 before:bg-white before:transition-all before:duration-500
    hover:before:w-128"
        >
          &lt; Back to Home
        </Link>
      </div>
      <div className="flex flex-col items-center justify-center bg-gray-100 py-6 px-4 sm:px-6 lg:px-8 w-auto max-w-xl mx-auto rounded-lg shadow-lg">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl sm:text-4xl md:text-5xl lg:text-4xl xl:text-5xl font-modak mb-2 bg-gradient-to-r from-blue-900 via-purple-800 to-pink-700 bg-clip-text text-transparent drop-shadow-lg p-8 py-2 uppercase leading-7 sm:leading-10 lg:leading-8 xl:leading-10">
              {isSignUp ? 'CREATE YOUR ACCOUNT' : 'SIGN IN TO YOUR ACCOUNT'}
            </h2>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleEmailLogin}>
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-700">{error}</div>
              </div>
            )}

            <div className="space-y-4">
              {isSignUp && (
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Username
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    required
                    className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Choose a username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    disabled={loading}
                  />
                </div>
              )}

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Enter your email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={isSignUp ? 'new-password' : 'current-password'}
                  required
                  className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder={
                    isSignUp
                      ? 'Create a password (min. 6 characters)'
                      : 'Enter your password'
                  }
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>

              {isSignUp && (
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    disabled={loading}
                  />
                </div>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 text-sm font-medium rounded-md text-blue-900 border border-blue-900 bg-transparent hover:bg-blue-50 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading
                  ? isSignUp
                    ? 'Creating account...'
                    : 'Signing in...'
                  : isSignUp
                    ? 'Create Account'
                    : 'Sign in'}
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-100 text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div>
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="group relative w-full flex justify-center px-6 py-2 border border-gray-300 text-sm font-medium rounded text-white bg-gradient-to-r from-blue-800 via-purple-800 to-pink-700 shadow hover:scale-105 hover:shadow-xl transition cursor-pointer text-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign in with Google
              </button>
            </div>

            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError('');
                  setUsername('');
                  setConfirmPassword('');
                }}
                disabled={loading}
                className="text-sm text-blue-900 hover:text-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSignUp
                  ? 'Already have an account? Sign in'
                  : "Don't have an account? Sign up"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
