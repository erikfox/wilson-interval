# Wilson Interval

Used to calculate the *high bound*, *low bound*, and *center* of a [Wilson score interval](http://en.wikipedia.org/wiki/Binomial_proportion_confidence_interval#Wilson_score_interval).

## API

```js
var wilson = require('wilson-interval')
```

### wilson.full(pos, neg [, z-score])

- `pos` - positive outcomes
- `neg` - negative outcomes
- `z-score` - the z-score (confidence level) of the interval. Defaults to 1.0 (~85% confidence).

Returns an object with `.high`, `.low`, and `.center` properties:

```
return wilson(40, 10 , 1.0);
```
will output
```
{
	"high": 0.8504368886915493,
	"center": 0.7941176470588236,
	"low": 0.7377984054260978
}
```