import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { activeIdFromViewable, shouldPlay, videos } from '../src/feed.ts';

test('only an active, foreground, unpaused player should play', () => {
  for (const active of [true, false]) for (const foreground of [true, false]) for (const paused of [true, false]) {
    assert.equal(shouldPlay(active, foreground, paused), active && foreground && !paused);
  }
});
test('viewability selects the visible item or pauses when none is visible', () => {
  assert.equal(activeIdFromViewable([{ item: videos[0] }]), videos[0].id);
  assert.equal(activeIdFromViewable([{ item: videos[1] }]), videos[1].id);
  assert.equal(activeIdFromViewable([]), null);
});
