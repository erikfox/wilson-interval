# Wilson Interval

A comprehensive module used to calculate the **high bound**, **low bound**, and **center** of a **[Wilson score interval](http://en.wikipedia.org/wiki/Binomial_proportion_confidence_interval#Wilson_score_interval)**. Features support for **[continuity correction](http://en.wikipedia.org/wiki/Binomial_proportion_confidence_interval#Wilson_score_interval_with_continuity_correction)** and **[Singleton's adjustment](https://corplingstats.wordpress.com/2012/04/30/inferential-statistics/)**.

Popularized by **[Reddit's Comment/Best Sort](http://amix.dk/blog/post/19588)** and similar voting algorithms.

### Install:

```console
npm install wilson-interval
```

### Include:

```js
var wilson = require('wilson-interval');
```
## Usage


###wilson(obs, total [, z-score][, pop][, cont])

- `obs` - observed positive outcomes (e.g. upvotes).
- `total` - total sample size (e.g. upvotes + downvotes).

Optional inputs:

- `z-score` - the z-score (critical value). Defaults to `1.96` (95% confidence interval).
- `pop` - to use [Singleton's adjustment](https://corplingstats.wordpress.com/2012/04/30/inferential-statistics/)<sup>[1]</sup>, enter the population size. Defaults `false`.
- `cont` - to use [continuity correction](http://en.wikipedia.org/wiki/Binomial_proportion_confidence_interval#Wilson_score_interval_with_continuity_correction), set `true`. Default `false`.

Returns an object with `.high`, `.low`, and `.center` properties:

```js
return wilson(40,100);
```
will output
```json
{
	high: 0.4979992153815976,
	center: 0.4036994807476002,
	low: 0.3093997461136029 
}
```

## Notes

### Low bound sorting

Most often, the **low bound** of the calculated Wilson score interval will be used as the sorting measure (e.g. **[Reddit's Comment/Best Sort](http://amix.dk/blog/post/19588)**). This places more importance on confidence than number of upvotes. 

Even if a new submission has 100% upvotes, this ensures it won't be ranked at the top until enough data has been gathered for the algorithm to be confident that that ratio is what it really deserves.

### Singleton's adjustment

Uses a known, finite population size to inform the degree of uncertainty of the prediction.

> ![Singleton's adjustment](https://corplingstats.files.wordpress.com/2012/04/popsamp1.png?w=538)

> Descriptive statistics summarises the sample as if it were the entire population (left), whereas inferential statistics assumes the sample is a tiny subset of the population (right). If the sample is a large part of the population the confidence interval on observations is reduced (middle).<sup>[1]</sup>

**USE WHEN:**

1. Your sample size represents a significant portion of the population.
2. You have an imperfect original sample, from which you can only verify a subsample. The original sample can serve as a "population" to produce a verification interval to be combined with the first.<sup>[2]</sup>

## Sources

<sup>[1]</sup> [Wallis, Sean 2012. *Inferential Statistics — and other animals*. London: Survey of English Usage, UCL.](https://corplingstats.wordpress.com/2012/04/30/inferential-statistics/)

<sup>[2]</sup> [Wallis, Sean 2014. *Coping with imperfect data*. London: Survey of English Usage, UCL.](https://corplingstats.wordpress.com/2014/04/10/imperfect-data/)

___
*Special thanks to Sean Wallis—Senior Research Fellow, Survey of English Usage—for his aid in transcribing equations, and for his blog posts which inspired many of the features of this module.*