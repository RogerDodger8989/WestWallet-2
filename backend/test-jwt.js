const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || 'dev-jwt-secret';

// Skapa en test-token
const payload = { sub: 1, username: 'dennis800121' };
const token = jwt.sign(payload, secret, { expiresIn: '1h' });

console.log('Generated token:', token);
console.log('\nVerifying token...');

try {
  const decoded = jwt.verify(token, secret);
  console.log('✓ Token verified successfully:', decoded);
} catch (err) {
  console.error('✗ Token verification failed:', err.message);
}
