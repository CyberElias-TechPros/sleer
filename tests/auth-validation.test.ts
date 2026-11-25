import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { validateCredentials, validateProfile } from '../src/auth/validation.ts';

test('authentication requires email and password', () => {
  assert.ok(validateCredentials('  ', 'password'));
  assert.ok(validateCredentials('a@example.com', ''));
  assert.equal(validateCredentials('a@example.com', 'password'), null);
});
test('profile validation enforces basic length limits', () => {
  assert.ok(validateProfile('  ', ''));
  assert.ok(validateProfile('a'.repeat(41), ''));
  assert.ok(validateProfile('name', 'b'.repeat(161)));
  assert.equal(validateProfile('name', 'b'.repeat(160)), null);
});
