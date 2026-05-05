export function classifyQuery(prompt) {
  if (!prompt || prompt.trim() === '') return 'unknown';

  const input = prompt.toLowerCase().trim();


  if (/^\d+\s*[\+\-\*\/]\s*\d+/.test(input)) {
    return 'math_simple';
  }


  if (/x\^2/.test(input)) {
    return 'math_quadratic';
  }


  if (/^\d*x[\+\-]\d+=\d+/.test(input)) {
    return 'math_linear';
  }


  const mathKeywords = [
    'solve', 'calculate', 'integrate', 'derivative',
    'algebra', 'geometry', 'calculus', 'matrix',
    'vector', 'log', 'sin', 'cos', 'tan', 'limit'
  ];

  const keywordMatch = mathKeywords.some(k =>
    new RegExp(`\\b${k}\\b`, 'i').test(prompt)
  );

  if (keywordMatch) return 'math_complex';

  return 'general';
}