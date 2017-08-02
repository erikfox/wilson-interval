'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.wilsonStandard = wilsonStandard;
exports.wilsonContinuity = wilsonContinuity;

exports.default = function (f, n) {
  var c = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.95;
  var N = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  var continuity = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

  var p = f / n; // proportion of positive outcomes

  if (N) {
    // if population size given:
    var v = Math.sqrt(1 - n / N); // determine scale factor
    n /= v; // and adjust sample size
  }

  var z = (0, _pnormaldist2.default)(1 - (1 - c) / 2); // calculate z-score: http://www.evanmiller.org/how-not-to-sort-by-average-rating.html

  return continuity ? wilsonContinuity(p, n, z) : wilsonStandard(p, n, z);
};

var _pnormaldist = require('pnormaldist');

var _pnormaldist2 = _interopRequireDefault(_pnormaldist);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Standard Wilson score interval
function wilsonStandard(p, n, z) {
  var high = (p + z * z / (2 * n) + z * Math.sqrt(p * (1 - p) / n + z * z / (4 * (n * n)))) / (1 + z * z / n);
  var low = (p + z * z / (2 * n) - z * Math.sqrt(p * (1 - p) / n + z * z / (4 * (n * n)))) / (1 + z * z / n);
  var center = (p + z * z / (2 * n)) / (1 + z * z / n);

  return {
    high: high,
    center: center,
    low: low
  };
}

// Wilson score interval with continuity correction
function wilsonContinuity(p, n, z) {
  var high = (2 * n * p + z * z + (z * Math.sqrt(z * z - 1 / n + 4 * n * p * (1 - p) - (4 * p - 2)) + 1)) / (2 * (n + z * z));
  var low = (2 * n * p + z * z - (z * Math.sqrt(z * z - 1 / n + 4 * n * p * (1 - p) + (4 * p - 2)) + 1)) / (2 * (n + z * z));
  var center = (2 * n * p + z * z) / (2 * (n + z * z));

  return {
    high: high,
    center: center,
    low: low
  };
}

/*
 * credit: Sean Wallis, Survey of English Usage, University College of London
 * source: https://corplingstats.wordpress.com/2012/04/30/inferential-statistics/
 */
;
