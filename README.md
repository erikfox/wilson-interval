# Wilson Interval

Used to calculate the *high bound*, *low bound*, and *center* of a [Wilson score interval](http://en.wikipedia.org/wiki/Binomial_proportion_confidence_interval#Wilson_score_interval).

## API

```js
var wilson = require('wilson-interval')
```

### wilson(pos, neg [, z-score])

- `pos` - positive outcomes
- `neg` - negative outcomes
- `z-score` - the z-score (confidence level) of the interval. Defaults to 1.0 (~85% confidence).
