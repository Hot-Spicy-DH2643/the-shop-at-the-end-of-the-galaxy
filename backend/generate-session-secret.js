#!/usr/bin/env node

/**
 * Generate a secure session secret for production use
 * Run with: node generate-session-secret.js
 */

import crypto from 'crypto';

const secret = crypto.randomBytes(64).toString('hex');

console.log('\n🔐 Generated Session Secret:\n');
console.log(secret);
console.log('\n📋 Add this to your .env file:');
console.log(`SESSION_SECRET=${secret}`);
console.log('\n⚠️  Keep this secret secure and never commit it to git!\n');
