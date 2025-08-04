import { inv, multiply, transpose } from 'mathjs';

export function linearFit(points: [number, number][]) {
  const n = points.length;
  if (n < 2) {
    return { fitX: [], fitY: [], rmse: NaN, r2: NaN, error: 'At least two points are required for linear fit.', equation: '' };
  }

  const sumX = points.reduce((acc, [x]) => acc + x, 0);
  const sumY = points.reduce((acc, [, y]) => acc + y, 0);
  const sumXY = points.reduce((acc, [x, y]) => acc + x * y, 0);
  const sumX2 = points.reduce((acc, [x]) => acc + x * x, 0);

  const denominator = n * sumX2 - sumX ** 2;
  if (denominator === 0) {
    return { fitX: [], fitY: [], rmse: NaN, r2: NaN, error: 'Denominator zero, cannot compute fit (check points).', equation: '' };
  }

  const slope = (n * sumXY - sumX * sumY) / denominator;
  const intercept = (sumY - slope * sumX) / n;

  const fitX = [Math.min(...points.map(p => p[0])), Math.max(...points.map(p => p[0]))];
  const fitY = fitX.map(x => slope * x + intercept);

  const residuals = points.map(([x, y]) => y - (slope * x + intercept));
  const mse = residuals.reduce((acc, r) => acc + r * r, 0) / n;
  const rmse = Math.sqrt(mse);
  const yMean = sumY / n;
  const ssTot = points.reduce((acc, [, y]) => acc + (y - yMean) ** 2, 0);
  const ssRes = residuals.reduce((acc, r) => acc + r ** 2, 0);
  const r2 = 1 - ssRes / ssTot;

  const equation = `y = ${slope.toFixed(3)}x + ${intercept.toFixed(3)}`;

  return { fitX, fitY, rmse, r2, error: null, equation };
}


export function polyFit(points: [number, number][], degree: number) {
  if (points.length === 0) {
    return { fitX: [], fitY: [], rmse: NaN, r2: NaN, error: "No data points provided.", equation: "" };
  }
  if (degree < 1) {
    return { fitX: [], fitY: [], rmse: NaN, r2: NaN, error: "Degree must be at least 1.", equation: "" };
  }
  if (degree >= points.length) {
    return { fitX: [], fitY: [], rmse: NaN, r2: NaN, error: "Degree must be less than number of points.", equation: "" };
  }

  try {
    const X = points.map(([x]) => Array.from({ length: degree + 1 }, (_, i) => x ** i));
    const Y = points.map(([, y]) => [y]);
    const Xt = transpose(X);
    const XtX = multiply(Xt, X);
    const XtY = multiply(Xt, Y);
    const coeffsMatrix = multiply(inv(XtX), XtY);
    const coeffs = coeffsMatrix.map(c => c[0]);

    const fitX = [];
    const minX = Math.min(...points.map(p => p[0]));
    const maxX = Math.max(...points.map(p => p[0]));
    // generate 100 points for smooth curve
    for (let i = 0; i <= 100; i++) {
      fitX.push(minX + (maxX - minX) * (i / 100));
    }
    const fitY = fitX.map(x => coeffs.reduce((sum, c, i) => sum + c * x ** i, 0));

    // Calculate error metrics
    const residuals = points.map(([x, y]) => y - coeffs.reduce((sum, c, i) => sum + c * x ** i, 0));
    const n = points.length;
    const mse = residuals.reduce((acc, r) => acc + r ** 2, 0) / n;
    const rmse = Math.sqrt(mse);
    const yMean = points.reduce((acc, [, y]) => acc + y, 0) / n;
    const ssTot = points.reduce((acc, [, y]) => acc + (y - yMean) ** 2, 0);
    const ssRes = residuals.reduce((acc, r) => acc + r ** 2, 0);
    const r2 = 1 - ssRes / ssTot;

    const equation = `y = ${coeffs.map((c, i) => `${c.toFixed(3)}x^${i}`).join(' + ')}`;

    return { fitX, fitY, rmse, r2, error: null, equation };
  } catch (e: any) {
    return { fitX: [], fitY: [], rmse: NaN, r2: NaN, error: e?.message || "An unknown error occurred in polynomial fitting.", equation: "" };
  }
}


export function powerFit(points: [number, number][]) {
  const filtered = points.filter(([x, y]) => x > 0 && y > 0);

  if (filtered.length === 0) {
    return { fitX: [], fitY: [], rmse: NaN, r2: NaN, error: "No points with positive x and y for power fit.", equation: "" };
  }
  if (filtered.length < 2) {
    return { fitX: [], fitY: [], rmse: NaN, r2: NaN, error: "At least two valid points are required.", equation: "" };
  }

  try {
    const n = filtered.length;
    const sumLnX = filtered.reduce((acc, [x]) => acc + Math.log(x), 0);
    const sumLnY = filtered.reduce((acc, [, y]) => acc + Math.log(y), 0);
    const sumLnXLnY = filtered.reduce((acc, [x, y]) => acc + Math.log(x) * Math.log(y), 0);
    const sumLnX2 = filtered.reduce((acc, [x]) => acc + Math.log(x) ** 2, 0);

    const denominator = n * sumLnX2 - sumLnX ** 2;
    if (denominator === 0) {
      return { fitX: [], fitY: [], rmse: NaN, r2: NaN, error: "Denominator is zero, can't compute fit (check data points).", equation: "" };
    }

    const a = (sumLnY * sumLnX2 - sumLnX * sumLnXLnY) / denominator;
    const b = (n * sumLnXLnY - sumLnX * sumLnY) / denominator;
    const A = Math.exp(a);

    if (!isFinite(A) || !isFinite(b)) {
      return { fitX: [], fitY: [], rmse: NaN, r2: NaN, error: "Computed parameters are not finite numbers.", equation: "" };
    }

    const fitX = [];
    const minX = Math.min(...filtered.map(p => p[0]));
    const maxX = Math.max(...filtered.map(p => p[0]));
    for (let i = 0; i <= 100; i++) {
      fitX.push(minX + (maxX - minX) * (i / 100));
    }
    const fitY = fitX.map(x => A * x ** b);

    const residuals = filtered.map(([x, y]) => y - (A * x ** b));
    const mse = residuals.reduce((acc, r) => acc + r ** 2, 0) / n;
    const rmse = Math.sqrt(mse);
    const yMean = filtered.reduce((acc, [, y]) => acc + y, 0) / n;
    const ssTot = filtered.reduce((acc, [, y]) => acc + (y - yMean) ** 2, 0);
    const ssRes = residuals.reduce((acc, r) => acc + r ** 2, 0);
    const r2 = 1 - ssRes / ssTot;

    const equation = `y = ${A.toFixed(3)}x^${b.toFixed(3)}`;

    return { fitX, fitY, rmse, r2, error: null, equation };
  } catch (e: any) {
    return { fitX: [], fitY: [], rmse: NaN, r2: NaN, error: e?.message || "Unknown error during power fitting.", equation: "" };
  }
}


export function exponentialFit(points: [number, number][]) {
  const filtered = points.filter(([x, y]) => x > 0 && y > 0);

  if (filtered.length === 0) {
    return { fitX: [], fitY: [], rmse: NaN, r2: NaN, error: "No points with positive x and y for exponential fit.", equation: "" };
  }
  if (filtered.length < 2) {
    return { fitX: [], fitY: [], rmse: NaN, r2: NaN, error: "At least two valid points are required.", equation: "" };
  }

  try {
    const n = filtered.length;
    const sumX = filtered.reduce((acc, [x]) => acc + x, 0);
    const sumLnY = filtered.reduce((acc, [, y]) => acc + Math.log(y), 0);
    const sumX2 = filtered.reduce((acc, [x]) => acc + x * x, 0);
    const sumXLnY = filtered.reduce((acc, [x, y]) => acc + x * Math.log(y), 0);

    const denominator = n * sumX2 - sumX ** 2;
    if (denominator === 0) {
      return { fitX: [], fitY: [], rmse: NaN, r2: NaN, error: "Denominator is zero, can't compute fit (check data points).", equation: "" };
    }

    const a = (sumLnY * sumX2 - sumX * sumXLnY) / denominator;
    const b = (n * sumXLnY - sumX * sumLnY) / denominator;
    const A = Math.exp(a);

    if (!isFinite(A) || !isFinite(b)) {
      return { fitX: [], fitY: [], rmse: NaN, r2: NaN, error: "Computed parameters are not finite numbers.", equation: "" };
    }

    const fitX = [];
    const minX = Math.min(...filtered.map(p => p[0]));
    const maxX = Math.max(...filtered.map(p => p[0]));
    for (let i = 0; i <= 100; i++) {
      fitX.push(minX + (maxX - minX) * (i / 100));
    }
    const fitY = fitX.map(x => A * Math.exp(b * x));

    const residuals = filtered.map(([x, y]) => y - (A * Math.exp(b * x)));
    const mse = residuals.reduce((acc, r) => acc + r ** 2, 0) / n;
    const rmse = Math.sqrt(mse);
    const yMean = filtered.reduce((acc, [, y]) => acc + y, 0) / n;
    const ssTot = filtered.reduce((acc, [, y]) => acc + (y - yMean) ** 2, 0);
    const ssRes = residuals.reduce((acc, r) => acc + r ** 2, 0);
    const r2 = 1 - ssRes / ssTot;

    const equation = `y = ${A.toFixed(3)}e^{${b.toFixed(3)}x}`;

    return { fitX, fitY, rmse, r2, error: null, equation };
  } catch (e: any) {
    return { fitX: [], fitY: [], rmse: NaN, r2: NaN, error: e?.message || "Unknown error during exponential fitting.", equation: "" };
  }
}
