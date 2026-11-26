import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { searchPattern } from '../src/search.ts';

test('caption search strips SQL/PostgREST wildcard and filter characters', () => {
  assert.equal(searchPattern('  hello, world*_(x)%\\  '), '%hello worldx%');
  assert.equal(searchPattern('100% fun'), '%100 fun%');
  assert.equal(searchPattern('Afrobeats 🎵'), '%Afrobeats 🎵%');
});
test('empty or only control characters cannot become a match-all search', () => {
  assert.equal(searchPattern('  '), null);
  assert.equal(searchPattern('%_*.(),\\'), null);
});
