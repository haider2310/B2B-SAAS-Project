import assert from 'node:assert';
import { test } from 'node:test';

// Simple utility function to test
function formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
}

test('formatDate returns correct date string', () => {
    const date = new Date('2023-01-01T12:00:00Z');
    assert.strictEqual(formatDate(date), '2023-01-01');
});

test('Basic Math Check', () => {
    assert.strictEqual(1 + 1, 2);
});
