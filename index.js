// index.js

// Dependencies
var pnormaldist = require('pnormaldist');

// Standard Wilson score interval
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

// Wilson score interval with continuity correction
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
 * credit: Sean Wallis, Survey of English Usage, University College of London
 * source: https://corplingstats.wordpress.com/2012/04/30/inferential-statistics/
 */
module.exports = function(f, n, c, N, continuity) {

    var p 	= f/n;				// proportion of positive outcomes
        N 	= N || false; 		// population size

    if (N) {							// if population size given:
        var v 	= Math.sqrt(1-n/N);		// determine scale factor
            n 	= n/v; 					// and adjust sample size
    }
	
		c 	= c || 0.95;		// confidence level, defaults to 95%
	
	var z 	= pnormaldist(1 - (1 - c) / 2); // calculate z-score: http://www.evanmiller.org/how-not-to-sort-by-average-rating.html

    if (continuity) return wilson_continuity(p, n, z);

    return wilson_standard(p, n, z);
};
