# Wilson Interval

Used to calculate the **high bound**, **low bound**, and **center** of a **[Wilson score interval](http://en.wikipedia.org/wiki/Binomial_proportion_confidence_interval#Wilson_score_interval)**. 

Popularized by **[Reddit's Comment Sort](http://amix.dk/blog/post/19588)** and similar voting algorithms.


### Include:

```js
var wilson = require('wilson-interval')
```
## Usage


###wilson.reg(pos, neg [, z-score])

*Standard [Wilson score interval](http://en.wikipedia.org/wiki/Binomial_proportion_confidence_interval#Wilson_score_interval).*

- `pos` - positive outcomes/votes
- `neg` - negative outcomes/votes
- `z-score` - the z-score (confidence level) of the interval. Defaults to 1.036 (85% confidence).

Returns an object with `.high`, `.low`, and `.center` properties:

```
return wilson.reg(40, 10 , 1.0);
```
will output something like
```
{
	"high": 0.8504368886915493,
	"center": 0.7941176470588236,
	"low": 0.7377984054260978
}
```

___

###wilson.cont(pos, neg [, z-score])

*Wilson score interval [with continuity correction](http://en.wikipedia.org/wiki/Binomial_proportion_confidence_interval#Wilson_score_interval_with_continuity_correction).*

- `pos` - positive outcomes/votes
- `neg` - negative outcomes/votes
- `z-score` - the z-score (confidence level) of the interval. Defaults to 1.036 (85% confidence).

Returns an object with `.high`, `.low`, and `.center` properties:

```
return wilson.cont(40, 10 , 1.0);
```
will output something like
```
{
	"high": 0.8504368886915493,
	"center": 0.7941176470588236,
	"low": 0.7377984054260978
}
```

____

###!COMING SOON! wilson.adj(pos, neg, pop [, z-score])

*Wilson score interval [with Singleton's Adjustment](https://corplingstats.wordpress.com/2012/04/30/inferential-statistics/). Greatly improves accuracy of interval as sample size approaches total population.*

- `pos` - positive outcomes/votes
- `neg` - negative outcomes/votes
- `pop` - population size
- `z-score` - the z-score (confidence level) of the interval. Defaults to 1.036 (85% confidence).

Returns an object with `.high`, `.low`, and `.center` properties:

```
return wilson.cont(40, 10 , 1.0);
```
will output something like
```
{
	"high": 0.8504368886915493,
	"center": 0.7941176470588236,
	"low": 0.7377984054260978
}
```