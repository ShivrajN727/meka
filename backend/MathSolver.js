// mathSolver.js


export function solveMath(prompt, type) {
  const cleaned = prompt
    .toLowerCase()
    .replace(/solve|calculate|what is/g, '')
    .trim();

  if (type === 'math_simple') return solveSimple(cleaned);
  if (type === 'math_quadratic') return solveQuadratic(cleaned);
  if (type === 'math_linear') return solveLinear(cleaned);

  return "Unsupported math type";
}




function solveSimple(input) {
  try {
    const expr = input.replace(/\s+/g, '');

    if (!/^[0-9+\-*/().]+$/.test(expr)) {
      return "Invalid expression";
    }

    const result = Function(`return (${expr})`)();
    return String(result);
  } catch {
    return "Invalid expression";
  }
}


function solveQuadratic(input) {
  const expr = input.replace(/\s+/g, '');

  const match = expr.match(
    /^([+-]?\d*)x\^2([+-]?\d*)x([+-]?\d+)?=([+-]?\d+)$/
  );

  if (!match) return "Unsupported quadratic format";

  let [, a, b, c, d] = match;

  a = a === '' || a === '+' ? 1 : a === '-' ? -1 : Number(a);
  b = b === '' || b === '+' ? 1 : b === '-' ? -1 : Number(b);
  c = c ? Number(c) : 0;
  d = Number(d);

  const A = a;
  const B = b;
  const C = c - d;

  const delta = B * B - 4 * A * C;
  const sqrtD = Math.sqrt(delta);

  const x1 = round((-B + sqrtD) / (2 * A));
  const x2 = round((-B - sqrtD) / (2 * A));

return [
  "Given equation:",
  `${A}x² + ${B}x + ${C} = 0`,
  "Using quadratic formula:",
  "x = (-b ± √(b² - 4ac)) / (2a)",
  "Substitute values:",
  `a = ${A}, b = ${B}, c = ${C}`,
  "Discriminant:",
  `Δ = ${B}² - 4(${A})(${C}) = ${delta}`,
  "Solutions:",
  `x₁ = ${x1}`,
  `x₂ = ${x2}`
].join('\n');
}


function solveLinear(input) {
  const expr = input.replace(/\s+/g, '');

  const match = expr.match(/^([+-]?\d*)x([+-]\d+)?=([+-]?\d+)$/);

  if (!match) return "Unsupported linear format";

  let [, a, b, c] = match;

  a = a === '' || a === '+' ? 1 : a === '-' ? -1 : Number(a);
  b = b ? Number(b) : 0;
  c = Number(c);

  const x = (c - b) / a;

  return `x = ${round(x)}`;
}


function round(num) {
  return Math.round(num * 1000) / 1000;
}