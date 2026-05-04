export function classifyQuery(prompt) {
  if (!prompt || prompt.trim() === '') return 'unknown';
  
  const mathKeywords = [
    'solve', 'calculate', 'integrate', 'derivative', 'equation',
    'algebra', 'geometry', 'calculus', 'matrix', 'vector',
    'factor', 'simplify', 'expand', 'polynomial', 'quadratic',
    'trigonometry', 'sin', 'cos', 'tan', 'logarithm', 'exponent',
    'multiply', 'divide', 'subtract', 'fraction', 'percentage',
    'prime', 'fibonacci', 'factorial', 'permutation', 'combination'
  ];

  const mathPatterns = [
    /\d+\s*[\+\-\*\/\^]\s*\d+/,
    /x\s*[\+\-\*\/\^]/,
    /\d+x/,
    /sqrt|log|ln|lim|sum|integral/i
  ];

  const lowerPrompt = prompt.toLowerCase();
  
  if (mathKeywords.some(k => lowerPrompt.includes(k))) return 'math';
  if (mathPatterns.some(p => p.test(prompt))) return 'math';
  
  return 'general';
}
