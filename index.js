// index.js

var exports = module.exports = {};

/*
 * Standard Wilson score interval
 *
 * source: http://www.ucl.ac.uk/english-usage/staff/sean/resources/CLSV-handout.pdf
 */
exports.reg = function(ups, downs, z) {
	
	var n = ups + downs;		// sample size
	if (n <= 0 || n < ups) return 0;

	var z = z || 1.036; 		// 1.036 = 85%, 1.645 = 95%
	var p = (ups/n);			// frequency
				
	var x = z*Math.sqrt(((p*(1-p))/n)+((z*z)/(4*(n*n))));
	
	var high 	= ((p+((z*z)/(2*n))) + x) / (1+((z*z)/n));
	var low 	= ((p+((z*z)/(2*n))) - x) / (1+((z*z)/n));
	var center 	= ((p+((z*z)/(2*n))) / (1+((z*z)/n)));
		
	var wilson = {
		high: high,
		center: center,
		low: low
	}
		
	return wilson;
}

/*
 * Wilson score interval with continuity correction
 *
 * source: http://en.wikipedia.org/wiki/Binomial_proportion_confidence_interval#Wilson_score_interval_with_continuity_correction
 */
exports.cont = function(ups, downs, z) {
	
	var n = ups + downs;		// sample size	
	if (n <= 0 || n < ups) return 0;

	var z = z || 1.036; // 1.036 = 85%, 1.645 = 95%
	var p = (ups/n);			// frequency
	
	var x		= (z*Math.sqrt((z*z)-(1/n)+(4*n*p*(1-p))-(4*p-2)+1));
	
	var high 	= (((2*n*p)+(z*z) + x) / (2*(n+(z*z))));
	var low 	= (((2*n*p)+(z*z) - x) / (2*(n+(z*z))));
	var center 	= (((2*n*p)+(z*z)) / (2*(n+(z*z))));
	
	var wilson = {
		high: high,
		center: center,
		low: low
	}
	
	return wilson;
}

/*
 * IN PROGRESS, bad notation in bound equations
 *
 * Wilson score interval with Singleton's Adjustment
 *
 * source: http://www.ucl.ac.uk/english-usage/staff/sean/resources/CLSV-handout.pdf
 */
exports.adj = function(ups, downs, N) {
	
	var n 	= ups + downs;			// sample size
	if (n <= 0 || n < ups) return 0;
	
	var N	= N;					// population size
	var z 	= z || 1.036; 			// 1.036 = 85%, 1.645 = 95%
	var p 	= ups/n;				// frequency
	var v 	= Math.sqrt(1-n/N); 	// scale factor
	var N1 	= n/v; 					// adjusted N
		
	var x 		= z*Math.sqrt(((p*(1-p))/N1)+((z*z)/(4*(N1*N1))));
	
	var high 	= ((p+((z*z)/(2*N1))) + x) / (1+((z*z)/N1));
	var low 	= ((p+((z*z)/(2*N1))) - x) / (1+((z*z)/N1));
	var center 	= ((p+((z*z)/(2*N1))) / (1+((z*z)/N1)));	
	
	var wilson = {
		high: high,
		center: center,
		low: low
	}
	
	return wilson;
}