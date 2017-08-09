'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = wilson;

var _mathjs = require('mathjs');

var _mathjs2 = _interopRequireDefault(_mathjs);

var _pnormaldist = require('pnormaldist');

var _pnormaldist2 = _interopRequireDefault(_pnormaldist);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function wilson(observed, sample) {
  var population = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var _options$confidence = options.confidence,
      confidence = _options$confidence === undefined ? 0.95 : _options$confidence,
      _options$precision = options.precision,
      precision = _options$precision === undefined ? 20 : _options$precision;


  _mathjs2.default.config({ number: 'BigNumber', precision: precision });

  observed = _mathjs2.default.bignumber(observed);
  sample = _mathjs2.default.bignumber(sample);

  var proportion = _mathjs2.default.eval('observed / sample', { observed: observed, sample: sample });

  if (population) {
    sample = _mathjs2.default.eval('sample / (sqrt(1 - sample / population))', {
      sample: sample,
      population: population
    });
  }

  var zScore = (0, _pnormaldist2.default)(_mathjs2.default.eval('1 - (1 - confidence) / 2', { confidence: confidence }));

  return wilsonInterval(proportion, sample, zScore);
}

function wilsonInterval(proportion, sample, zScore) {
  var scope = {
    p: _mathjs2.default.bignumber(proportion),
    n: _mathjs2.default.bignumber(sample),
    z: _mathjs2.default.bignumber(zScore)
  };

  var high = _mathjs2.default.format(_mathjs2.default.eval('(p + z * z / (2 * n) + z * sqrt(p * (1 - p) / n + z * z / (4 * (n * n)))) / (1 + z * z / n)', scope));

  var low = _mathjs2.default.format(_mathjs2.default.eval('(p + z * z / (2 * n) - z * sqrt(p * (1 - p) / n + z * z / (4 * (n * n)))) / (1 + z * z / n)', scope));

  var center = _mathjs2.default.format(_mathjs2.default.eval('(p + z * z / (2 * n)) / (1 + z * z / n)', scope));

  return {
    high: high,
    center: center,
    low: low
  };
}