# Wilson Interval

[<img src="https://img.shields.io/twitter/follow/erkfox.svg?style=social&label=Say%20hello!" align="right" alt="Twitter @erkfox" />](https://twitter.com/erkfox)

[![license](https://img.shields.io/github/license/erikfox/wilson-interval.svg)](https://opensource.org/licenses/MIT)
[![npm](https://img.shields.io/npm/v/wilson-interval.svg)](https://www.npmjs.com/package/wilson-interval)
[![npm](https://img.shields.io/npm/dt/wilson-interval.svg?colorB=32CD32)](https://www.npmjs.com/package/wilson-interval)
[![CircleCI](https://img.shields.io/circleci/project/github/erikfox/wilson-interval.svg?colorB=32CD32)](https://circleci.com/gh/erikfox/wilson-interval/tree/master)
[![Coveralls](https://img.shields.io/coveralls/erikfox/wilson-interval.svg?colorB=32CD32)](https://coveralls.io/github/erikfox/wilson-interval)


[![Pull Requests Welcome](https://img.shields.io/badge/pull_requests-welcome-FF69B4.svg)]()
[![](https://img.shields.io/github/issues-raw/erikfox/wilson-interval.svg?colorB=FF69B4)](https://github.com/erikfox/wilson-interval/issues)

A comprehensive module used to calculate the **high bound**, **low bound**, and **center** of a **[Wilson score interval](http://en.wikipedia.org/wiki/Binomial_proportion_confidence_interval#Wilson_score_interval)**. Features support for known populations (i.e. **[Singleton's adjustment](https://corplingstats.wordpress.com/2012/04/30/inferential-statistics/)**).

Popularized by **[Reddit's Comment/Best Sort](http://amix.dk/blog/post/19588)** and similar voting algorithms.

### Install

```sh
npm install wilson-interval
```

### Include

```js
import wilson from 'wilson-interval';
```

## Usage

### wilson(observed, sample[, population ][, options ]);

- `observed` - Number of observed positive outcomes.

- `sample` - Size of sample.

Optional arguments:

- `population` - Default `false`. Total population from which sample was taken (to use **[Singleton's adjustment](https://corplingstats.wordpress.com/2012/04/30/inferential-statistics/)**<sup>[1]</sup>).

- `options` - Default `{}`. Options object. Available parameters:

	- `confidence` - Default `0.95`. Desired confidence level of interval.
	- `precision` - Default `20`. Number of significant figures to use in calculations and output.

#### Example
```js
return wilson(5, 100);
```
returns
```json
{
  "center": "0.066647073981204927863",
  "high": "0.11175046869375655694",
  "low": "0.021543679268653298792",
}
```

## Use cases

### Low bound sorting

Most often, the **low bound** of the interval will be used as the sorting parameter (e.g. **[Reddit's Comment/Best Sort](http://amix.dk/blog/post/19588)**). This places more importance on confidence than total score.

Even if a ranked item has 100% positive responses, this ensures it won't be ranked at the top until enough data has been gathered for the algorithm to be confident that that ratio is what it really deserves.

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
