import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { isWriteLimitError } from '../src/errors.ts';

test('identifies only the explicit server write-limit marker', () => {
  assert.equal(isWriteLimitError({ message: 'SLEER_RATE_LIMIT' }), true);
  assert.equal(isWriteLimitError({ error: 'SLEER_RATE_LIMIT' }), true);
  assert.equal(isWriteLimitError({ message: 'Network timeout' }), false);
  assert.equal(isWriteLimitError({ code: 'P0001' }), false);
  assert.equal(isWriteLimitError(null), false);
});
