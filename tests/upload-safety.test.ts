import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { shouldRemoveFailedUpload } from '../src/uploadSafety.ts';

test('cleanup only an uploaded object before metadata was attempted', () => {
  assert.equal(shouldRemoveFailedUpload(false, false), false);
  assert.equal(shouldRemoveFailedUpload(true, false), true);
  assert.equal(shouldRemoveFailedUpload(true, true), false);
  assert.equal(shouldRemoveFailedUpload(false, true), false);
});
