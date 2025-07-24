export default function wilson(observed, sample, population = null, confidence = 0.95) {
  observed = Number(observed);
  sample = Number(sample);

  if (Number.isSafeInteger(population)) {
    sample = sample / Math.sqrt(1 - sample / population);
  }

  const zScore = normalQuantile(1 - (1 - confidence) / 2);

  const p = observed / sample;
  const n = sample;
  const z = zScore;

  const high = ((p + z * z / (2 * n) + z * Math.sqrt(p * (1 - p) / n + z * z / (4 * n * n))) / (1 + z * z / n));
  const low = ((p + z * z / (2 * n) - z * Math.sqrt(p * (1 - p) / n + z * z / (4 * n * n))) / (1 + z * z / n));
  const center = ((p + z * z / (2 * n)) / (1 + z * z / n));

  return {
    high,
    center,
    low,
  };
}

// Returns the quantile (inverse CDF) for the standard normal distribution
export function normalQuantile(p) {
  if (p < 0 || p > 1) {
    throw new Error('The probability p must be between 0 and 1');
  }
  if (p === 0) return -Infinity;
  if (p === 1) return Infinity;

  // Coefficients in rational approximations
  const a = [
    -3.969683028665376e+01,
     2.209460984245205e+02,
    -2.759285104469687e+02,
     1.383577518672690e+02,
    -3.066479806614716e+01,
     2.506628277459239e+00
  ];
  const b = [
    -5.447609879822406e+01,
     1.615858368580409e+02,
    -1.556989798598866e+02,
     6.680131188771972e+01,
    -1.328068155288572e+01
  ];
  const c = [
    -7.784894002430293e-03,
    -3.223964580411365e-01,
    -2.400758277161838e+00,
    -2.549732539343734e+00,
     4.374664141464968e+00,
     2.938163982698783e+00
  ];
  const d = [
     7.784695709041462e-03,
     3.224671290700398e-01,
     2.445134137142996e+00,
     3.754408661907416e+00
  ];

  // Define break-points
  const plow = 0.02425;
  const phigh = 1 - plow;

  let q, r;
  if (p < plow) {
    // Rational approximation for lower region
    q = Math.sqrt(-2 * Math.log(p));
    return (((((c[0]*q + c[1])*q + c[2])*q + c[3])*q + c[4])*q + c[5]) /
           ((((d[0]*q + d[1])*q + d[2])*q + d[3])*q + 1);
  } else if (phigh < p) {
    // Rational approximation for upper region
    q = Math.sqrt(-2 * Math.log(1 - p));
    return -(((((c[0]*q + c[1])*q + c[2])*q + c[3])*q + c[4])*q + c[5]) /
             ((((d[0]*q + d[1])*q + d[2])*q + d[3])*q + 1);
  } else {
    // Rational approximation for central region
    q = p - 0.5;
    r = q * q;
    return (((((a[0]*r + a[1])*r + a[2])*r + a[3])*r + a[4])*r + a[5])*q /
           (((((b[0]*r + b[1])*r + b[2])*r + b[3])*r + b[4])*r + 1);
  }
}