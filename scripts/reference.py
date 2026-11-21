#!/usr/bin/env python3
"""Independent reference values for the wilson-interval tests.

Standard library only. Writes JSON to stdout; the committed copy lives in
scripts/reference.json and CI checks that it matches this script's output:

    python3 scripts/reference.py > scripts/reference.json

This does not port src/index.js. The Wilson score interval is the set of
proportions pi with |p - pi| <= z * sqrt(pi * (1 - pi) / n), so the bounds are
the roots of the quadratic

    (1 + z^2/n) pi^2 - (2p + z^2/n) pi + p^2 = 0

and the center is their midpoint. z comes from statistics.NormalDist, not from
the JS normalQuantile approximation.

With a known population N, n is replaced by n' = n (N - 1) / (N - n): the
variance of sampling without replacement, as in Wallis (2012), "Inferential
statistics -- and other animals". p is unchanged, and n = N gives zero width.
"""

import json
import math
import sys
from statistics import NormalDist


def wilson(observed, sample, population=None, confidence=0.95):
    p = observed / sample
    if population is not None and sample == population:
        return {"low": p, "center": p, "high": p}
    n = sample if population is None else sample * (population - 1) / (population - sample)
    z = NormalDist().inv_cdf(1 - (1 - confidence) / 2)
    k = z * z / n
    a = 1 + k
    b = -(2 * p + k)
    c = p * p
    root = math.sqrt(b * b - 4 * a * c)
    high = (-b + root) / (2 * a)
    # Product of the roots is c / a; this avoids cancellation in -b - root
    low = c / (a * high)
    # Exact boundary values; the quadratic formula can drift by an ulp
    if observed == 0:
        low = 0.0
    if observed == sample:
        high = 1.0
    return {"low": low, "center": (low + high) / 2, "high": high}


# (observed, sample, population, confidence)
WILSON_CASES = [
    (5, 100, None, 0.95),
    (0, 10, None, 0.95),
    (10, 10, None, 0.95),
    (0, 1, None, 0.95),
    (1, 1, None, 0.95),
    (1, 2, None, 0.5),
    (50, 100, None, 0.99),
    (999, 1000, None, 0.999),
    (1, 10**9, None, 0.95),
    (5 * 10**8, 10**9, None, 0.95),
    (5, 100, 227, 0.95),
    (5, 100, 227, 0.9),
    (3, 10, 20, 0.95),
    (123, 456, 1000, 0.8),
    (1, 1, 2, 0.95),
    (99, 100, 101, 0.95),
    (5, 100, 100, 0.95),
]

QUANTILE_CASES = [1e-10, 0.001, 0.01, 0.02425, 0.025, 0.05, 0.1, 0.5, 0.9, 0.95, 0.975, 0.99, 0.995, 0.999]


def main():
    out = {
        "wilson": [
            {
                "args": {"observed": o, "sample": s, "population": n, "confidence": c},
                "expected": wilson(o, s, n, c),
            }
            for o, s, n, c in WILSON_CASES
        ],
        "normalQuantile": [{"p": p, "expected": NormalDist().inv_cdf(p)} for p in QUANTILE_CASES],
    }
    json.dump(out, sys.stdout, indent=2)
    sys.stdout.write("\n")


if __name__ == "__main__":
    main()
