import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateText } from '../utils/validateText.js';

test('rejects non-string input', () => {
  assert.equal(validateText(123).valid, false);
});

test('rejects empty text', () => {
  assert.equal(validateText('   ').valid, false);
});

test('rejects text over 5000 chars', () => {
  assert.equal(validateText('a'.repeat(5001)).valid, false);
});

test('trims and accepts valid text', () => {
  assert.deepEqual(validateText('  I flew  '), { valid: true, value: 'I flew WRONG' });
});
