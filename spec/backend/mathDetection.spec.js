const { classifyQuery } = require('../../backend/math');

describe('Math Query Detection', () => {

  it('should classify math queries with keywords', () => {
    expect(classifyQuery('solve x^2 + 5x + 6 = 0')).toBe('math');
    expect(classifyQuery('integrate x^2')).toBe('math');
    expect(classifyQuery('calculate 15% of 200')).toBe('math');
  });

  it('should classify arithmetic expressions as math', () => {
    expect(classifyQuery('what is 2 + 2')).toBe('math');
    expect(classifyQuery('3 * 4')).toBe('math');
  });

  it('should not classify non-math queries as math', () => {
    expect(classifyQuery('hello world')).toBe('general');
    expect(classifyQuery('what is the weather')).toBe('general');
  });

  it('should return unknown for empty input', () => {
    expect(classifyQuery('')).toBe('unknown');
    expect(classifyQuery(null)).toBe('unknown');
  });

});
