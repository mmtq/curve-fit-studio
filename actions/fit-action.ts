import { inv, multiply, transpose } from 'mathjs';


export function linearFit(points: [number, number][]) {
  const n = points.length;
  if (n < 2) {
    return { slope: NaN, intercept: NaN, rmse: NaN, r2: NaN, error: 'At least two points are required for linear fit.' };
  }

  const sumX = points.reduce((acc, [x]) => acc + x, 0);
  const sumY = points.reduce((acc, [, y]) => acc + y, 0);
  const sumXY = points.reduce((acc, [x, y]) => acc + x * y, 0);
  const sumX2 = points.reduce((acc, [x]) => acc + x * x, 0);

  const denominator = n * sumX2 - sumX ** 2;
  if (denominator === 0) {
    return { slope: NaN, intercept: NaN, rmse: NaN, r2: NaN, error: 'Denominator zero, cannot compute fit (check points).' };
  }

  const slope = (n * sumXY - sumX * sumY) / denominator;
  const intercept = (sumY - slope * sumX) / n;

  const residuals = points.map(([x, y]) => y - (slope * x + intercept));
  const mse = residuals.reduce((acc, r) => acc + r * r, 0) / n;
  const rmse = Math.sqrt(mse);
  const yMean = sumY / n;
  const ssTot = points.reduce((acc, [, y]) => acc + (y - yMean) ** 2, 0);
  const ssRes = residuals.reduce((acc, r) => acc + r ** 2, 0);
  const r2 = 1 - ssRes / ssTot;

  return { slope, intercept, rmse, r2, error: null };
}


export function polyFit(points: [number, number][], degree: number): { coeffs: number[] | null; error: string | null } {
  if (points.length === 0) {
    return { coeffs: null, error: "No data points provided." };
  }
  if (degree < 1) {
    return { coeffs: null, error: "Degree must be at least 1." };
  }
  if (degree >= points.length) {
    return { coeffs: null, error: "Degree must be less than number of points." };
  }

  try {
    const X = points.map(([x]) => Array.from({ length: degree + 1 }, (_, i) => x ** i));
    const Y = points.map(([, y]) => [y]);
    const Xt = transpose(X);
    const XtX = multiply(Xt, X);

    // Check if XtX is invertible by determinant (optional, but mathjs doesn't have det for matrices, so catch error instead)
    // Alternatively, try-catch covers inversion failure.

    const XtY = multiply(Xt, Y);
    const coeffsMatrix = multiply(inv(XtX), XtY);
    const coeffs = coeffsMatrix.map(c => c[0]);
    return { coeffs, error: null };
  } catch (e: any) {
    return { coeffs: null, error: e?.message || "An unknown error occurred in polynomial fitting." };
  }
}

export function evaluatePoly(coeffs: number[], x: number): number {
  return coeffs.reduce((sum, c, i) => sum + c * x ** i, 0);
}

export function getPolyErrorMetrics(points: [number, number][], coeffs: number[]) {
  const residuals = points.map(([x, y]) => y - evaluatePoly(coeffs, x));
  const n = points.length;
  const mse = residuals.reduce((acc, r) => acc + r ** 2, 0) / n;
  const rmse = Math.sqrt(mse);
  const yMean = points.reduce((acc, [, y]) => acc + y, 0) / n;
  const ssTot = points.reduce((acc, [, y]) => acc + (y - yMean) ** 2, 0);
  const ssRes = residuals.reduce((acc, r) => acc + r ** 2, 0);
  const r2 = 1 - ssRes / ssTot;
  return { rmse, r2 };
}


export function powerFit(points: [number, number][]): { params: [number, number] | null; error: string | null } {
    const filtered = points.filter(([x, y]) => x > 0 && y > 0);

    if (filtered.length === 0) {
        return { params: null, error: "No points with positive x and y for power fit." };
    }
    if (filtered.length < 2) {
        return { params: null, error: "At least two valid points are required." };
    }

    try {
        const n = filtered.length;
        const sumLnX = filtered.reduce((acc, [x]) => acc + Math.log(x), 0);
        const sumLnY = filtered.reduce((acc, [, y]) => acc + Math.log(y), 0);
        const sumLnXLnY = filtered.reduce((acc, [x, y]) => acc + Math.log(x) * Math.log(y), 0);
        const sumLnX2 = filtered.reduce((acc, [x]) => acc + Math.log(x) ** 2, 0);

        const denominator = n * sumLnX2 - sumLnX ** 2;
        if (denominator === 0) {
            return { params: null, error: "Denominator is zero, can't compute fit (check data points)." };
        }

        const a = (sumLnY * sumLnX2 - sumLnX * sumLnXLnY) / denominator;
        const b = (n * sumLnXLnY - sumLnX * sumLnY) / denominator;

        const A = Math.exp(a);

        if (!isFinite(A) || !isFinite(b)) {
            return { params: null, error: "Computed parameters are not finite numbers." };
        }

        return { params: [A, b], error: null };
    } catch (e: any) {
        return { params: null, error: e?.message || "Unknown error during power fitting." };
    }
}

export function evaluatePower([A, b]: [number, number], x: number): number {
    return A * x ** b;
}

export function getPowerErrorMetrics(points: [number, number][], params: [number, number]) {
    const residuals = points.map(([x, y]) => y - evaluatePower(params, x));
    const n = points.length;
    const mse = residuals.reduce((acc, r) => acc + r ** 2, 0) / n;
    const rmse = Math.sqrt(mse);
    const yMean = points.reduce((acc, [, y]) => acc + y, 0) / n;
    const ssTot = points.reduce((acc, [, y]) => acc + (y - yMean) ** 2, 0);
    const ssRes = residuals.reduce((acc, r) => acc + r ** 2, 0);
    const r2 = 1 - ssRes / ssTot;
    return { rmse, r2 };
}

export function exponentialFit(points: [number, number][]): { params: [number, number] | null; error: string | null } {
    // Filter points with positive x and y, otherwise log error
    const filtered = points.filter(([x, y]) => x > 0 && y > 0);

    if (filtered.length === 0) {
        return { params: null, error: "No points with positive x and y for exponential fit." };
    }

    if (filtered.length < 2) {
        return { params: null, error: "At least two valid points are required." };
    }

    try {
        const n = filtered.length;
        const sumX = filtered.reduce((acc, [x]) => acc + x, 0);
        const sumLnY = filtered.reduce((acc, [, y]) => acc + Math.log(y), 0);
        const sumX2 = filtered.reduce((acc, [x]) => acc + x * x, 0);
        const sumXLnY = filtered.reduce((acc, [x, y]) => acc + x * Math.log(y), 0);

        const denominator = n * sumX2 - sumX ** 2;
        if (denominator === 0) {
            return { params: null, error: "Denominator is zero, can't compute fit (check data points)." };
        }

        const a = (sumLnY * sumX2 - sumX * sumXLnY) / denominator;
        const b = (n * sumXLnY - sumX * sumLnY) / denominator;
        const A = Math.exp(a);

        if (!isFinite(A) || !isFinite(b)) {
            return { params: null, error: "Computed parameters are not finite numbers." };
        }

        return { params: [A, b], error: null };
    } catch (e: any) {
        return { params: null, error: e?.message || "Unknown error during exponential fitting." };
    }
}

export function evaluateExp([A, b]: [number, number], x: number): number {
    return A * Math.exp(b * x);
}

export function getExpoErrorMetrics(points: [number, number][], params: [number, number]) {
    const residuals = points.map(([x, y]) => y - evaluateExp(params, x));
    const n = points.length;
    const mse = residuals.reduce((acc, r) => acc + r ** 2, 0) / n;
    const rmse = Math.sqrt(mse);
    const yMean = points.reduce((acc, [, y]) => acc + y, 0) / n;
    const ssTot = points.reduce((acc, [, y]) => acc + (y - yMean) ** 2, 0);
    const ssRes = residuals.reduce((acc, r) => acc + r ** 2, 0);
    const r2 = 1 - ssRes / ssTot;
    return { rmse, r2 };
}
