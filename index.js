// index.js

//exports = module.exports = {}

function wilson_standard(p, n, z) {

    var high 	= ((p+((z*z)/(2*n))) + (z*Math.sqrt(((p*(1-p))/n)+((z*z)/(4*(n*n))))) ) / (1+((z*z)/n));
    var low 	= ((p+((z*z)/(2*n))) - (z*Math.sqrt(((p*(1-p))/n)+((z*z)/(4*(n*n))))) ) / (1+((z*z)/n));
    var center 	= ((p+((z*z)/(2*n))) / (1+((z*z)/n)));

    var interval = {
        high: high,
        center: center,
        low: low
    }

    return interval;
}

function wilson_continuity(p, n, z) {

    var high 	= (((2*n*p)+(z*z) + (z*Math.sqrt((z*z)-(1/n)+(4*n*p*(1-p)) - (4*p-2))+1)) / (2*(n+(z*z))));
    var low 	= (((2*n*p)+(z*z) - (z*Math.sqrt((z*z)-(1/n)+(4*n*p*(1-p)) + (4*p-2))+1)) / (2*(n+(z*z))));
    var center 	= (((2*n*p)+(z*z)) / (2*(n+(z*z))));

    var interval = {
        high: high,
        center: center,
        low: low
    }

    return interval;
}

/*
 * Standard Wilson score interval
 *
 * credit: Sean Wallis, Survey of English Usage, University College of London
 * source: https://corplingstats.wordpress.com/2012/04/30/inferential-statistics/
 */
module.exports = function(f, n, z, N, c, confidence) {

    var p 	= f/n;				// proportion of positive outcomes
        z 	= z || 1.95996;		// critical value, two-tailed
        N 	= N || false; 		// population size

    if (N) {							// if population size given:
        var v 	= Math.sqrt(1-n/N);		// determine scale factor
            n 	= n/v; 					// and adjust sample size
    }

    // http://www.evanmiller.org/how-not-to-sort-by-average-rating.html
    if (confidence) {
        var pnormaldist = require('pnormaldist');
        /* The z-score in this function never changes, so if you don't have a
           statistics package handy or if performance is an issue you can always
           hard-code a value here for z. (Use 1.96 for a confidence level of
           0.95.) */
        z = pnormaldist(1 - (1 - confidence) / 2); //inverse of normal distribution
    }

    if (c) { return wilson_continuity(p, n, z); }

    return wilson_standard(p, n, z);
};

/*
 * Wilson score interval with continuity correction
 *
 * source: http://en.wikipedia.org/wiki/Binomial_proportion_confidence_interval#Wilson_score_interval_with_continuity_correction

exports.cont = function(f, n, z, N) {

    var p 	= f/n;				// proportion of positive outcomes
    var z 	= z || 1.96;		// critical value
    var N 	= N || false; 		// population size

    if (N) {							// if population size given:
        var v 	= Math.sqrt(1-n/N);		// determine scale factor
            n 	= n/v; 					// and adjust sample size
    }

    return wilson_continuity(p, n, z);
}
 */


/*
 * IN PROGRESS, bad notation in bound equations
 *
 * Wilson score interval with Singleton's Adjustment
 *
 * credit: Sean Wallis, Survey of English Usage, University College of London
 * source: http://www.ucl.ac.uk/english-usage/staff/sean/resources/CLSV-handout.pdf
 * reference: http://www.ucl.ac.uk/english-usage/staff/sean/resources/wilson-s-pop-interval.xls

exports.adj = function(ups, downs, N, z) {


    // Known values
    var a 	= 0.05; 	// alpha, significance level
    var z 	= 1.96; 	// critical value
    var n 	= 100; 		// sample size
    var f 	= 5;		// observed frequency positive outcomes
    var N 	= 227; 		// population size

    // Computed values
    var p 	= f/n;						// proportion of positive outcomes
    var s 	= Math.sqrt((p*(1-p))/n);	// standard deviation
    var v 	= Math.sqrt(1-n/N);			// scale factor
        n 	= n/v; 						// adjusted sample size

    var z2n	= (z*z) / n;

    var high 	= ((p+((z*z)/(2*n))) + (z*Math.sqrt(((p*(1-p))/n)+((z*z)/(4*(n*n))))) ) / (1+((z*z)/n));
    var low 	= ((p+((z*z)/(2*n))) - (z*Math.sqrt(((p*(1-p))/n)+((z*z)/(4*(n*n))))) ) / (1+((z*z)/n));
    var center 	= ((p+((z*z)/(2*n))) / (1+((z*z)/n)));

    console.log(JSON.stringify({
        a: a,
        z: z,
        n: n,
        N: N,
        p: p,
        s: s,
        v: v,
        z2n: z2n,
        low: low,
        high: high,
        center: center
    }, false, '\t'));
}
*/
