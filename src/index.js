const OPTIONS = ['population', 'confidence'];

const MIGRATION_ERROR =
  'wilson() takes an options object as its third argument since v6. ' +
  'Replace wilson(observed, sample, population, confidence) with ' +
  'wilson(observed, sample, { population, confidence }).';

export default function wilson(observed, sample, options = {}) {
  // v5 took population and confidence as positional arguments; catch those
  // calls explicitly rather than misreading them
  if (arguments.length > 3 || typeof options === 'number' || options === null) {
    throw new Error(MIGRATION_ERROR);
  }

  if (typeof options !== 'object' || Array.isArray(options)) {
    throw new Error('Options must be an object');
  }

  for (const key of Object.keys(options)) {
    if (!OPTIONS.includes(key)) {
      throw new Error(`Unknown option "${key}" (expected one of: ${OPTIONS.join(', ')})`);
    }
  }

  const { population, confidence = 0.95 } = options;

  if (!Number.isSafeInteger(observed) || observed < 0) {
    throw new Error('Observed must be a non-negative whole number');
  }

  if (!Number.isSafeInteger(sample) || sample <= 0) {
    throw new Error('Sample must be a positive whole number');
  }

  if (observed > sample) {
    throw new Error('Observed must not exceed sample');
  }

  if (typeof confidence !== 'number' || Number.isNaN(confidence) || confidence <= 0 || confidence >= 1) {
    throw new Error('Confidence must be a decimal between 0 and 1');
  }

  const p = observed / sample;
  let n = sample;

  if (population !== undefined) {
    if (!Number.isSafeInteger(population) || population <= 0) {
      throw new Error('Population must be a positive whole number');
    }
    if (sample > population) {
      throw new Error('Sample must not exceed population');
    }
    // The whole population was observed, so there is no uncertainty
    if (sample === population) {
      return { high: p, center: p, low: p };
    }
    // Finite population correction: the standard deviation scales by
    // ν = √((N − n) / (N − 1)), the exact hypergeometric factor, which is
    // equivalent to dividing n by ν². p is unchanged.
    // See Wallis (2012), "Inferential statistics — and other animals".
    n = sample * (population - 1) / (population - sample);
  }

  // Computed from the lower tail so confidence near 1 keeps its precision
  // (1 − (1 − confidence) / 2 can round to exactly 1 and give z = Infinity)
  const z = -normalQuantile((1 - confidence) / 2);

  const denominator = 1 + z * z / n;
  const center = (p + z * z / (2 * n)) / denominator;
  const margin = z * Math.sqrt(p * (1 - p) / n + z * z / (4 * n * n)) / denominator;

  // The bounds are exactly 0 at p = 0 and exactly 1 at p = 1; elsewhere, clamp
  // away floating-point drift so that 0 ≤ low ≤ p ≤ high ≤ 1 always holds
  const low = observed === 0 ? 0 : Math.max(0, Math.min(center - margin, p));
  const high = observed === sample ? 1 : Math.min(1, Math.max(center + margin, p));

  return {
    high,
    center,
    low,
  };
}

// Returns the quantile (inverse CDF) for the standard normal distribution
export function normalQuantile(p) {
  if (Number.isNaN(p) || p < 0 || p > 1) {
    throw new Error('p must be a decimal between 0 and 1');
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