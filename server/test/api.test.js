// Server API Unit & Integration Tests
import test from 'node:test';
import assert from 'node:assert';
import { generateToken, generateRefreshToken, verifyToken } from '../src/utils/jwt.js';

test('JWT Utility - generate and verify token', () => {
  const dummyUser = { id: 1, name: 'Test User', email: 'test@example.com' };
  const token = generateToken(dummyUser);
  
  assert.ok(token, 'Token should be generated');
  assert.strictEqual(typeof token, 'string', 'Token should be a string');

  const decoded = verifyToken(token);
  assert.strictEqual(decoded.userId, dummyUser.id);
});

test('Environment Config Loader', async () => {
  const { config } = await import('../src/config/env.js');
  assert.ok(config.port, 'Port should be defined');
  assert.ok(config.nodeEnv, 'Node environment should be defined');
});
