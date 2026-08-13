// Server API Unit & Integration Tests
import test from 'node:test';
import assert from 'node:assert';

// Set dummy test environment variables prior to dynamic module imports
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/hexatest';
process.env.PORT = '5000';
process.env.JWT_SECRET = 'test_jwt_secret_key_12345';
process.env.JWT_REFRESH_SECRET = 'test_jwt_refresh_secret_key_12345';

test('JWT Utility - generate and verify token', async () => {
  const { generateToken, verifyToken } = await import('../src/utils/jwt.js');
  const dummyUser = { id: 1, name: 'Test User', email: 'test@example.com' };
  const token = generateToken(dummyUser);
  
  assert.ok(token, 'Token should be generated');
  assert.strictEqual(typeof token, 'string', 'Token should be a string');

  const decoded = verifyToken(token);
  assert.strictEqual(decoded.userId, dummyUser.id);
});

test('Environment Config Loader', async () => {
  const { default: config } = await import('../src/config/env.js');
  assert.ok(config.port, 'Port should be defined');
  assert.ok(config.nodeEnv, 'Node environment should be defined');
});
