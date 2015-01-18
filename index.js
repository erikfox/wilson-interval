// index.js

var exports = module.exports = {};

/*
 * Standard Wilson score interval
 *
 * source: http://en.wikipedia.org/wiki/Binomial_proportion_confidence_interval#Wilson_score_interval
 */
exports.reg = function(ups, downs, z) {
	
	var n = ups + downs;	
	if (n <= 0 || n < ups) return 0;

	var z = z || 1.036; // 1.036 = 85%, 1.645 = 95%
	var p = (ups/n);
			
	var high = ((1/(1+((1/n)*(z*z))))*((p+((1/(2*n))*(z*z)))+(z*Math.sqrt(((1/n)*p*(1-p))+((1/(4*(n*n)))*(z*z))))));
	var low = ((1/(1+((1/n)*(z*z))))*((p+((1/(2*n))*(z*z)))-(z * Math.sqrt(((1/n)*p*(1-p))+((1/(4*(n*n)))*(z*z))))));
	var center = (high+low)/2; // or for independent calculation = ((p+((1/(2*n))*(z*z)))/(1+((1/n)*(z*z))));
		
	var wilson = {
		high: high,
		center: center,
		low: low
	}
	
	/*var left = (1/(1+((1/n)*(z*z))));
	var middle = (p+((1/(2*n))*(z*z)));
	var diff = (z * Math.sqrt(((1/n)*p*(1-p))+((1/(4*(n*n)))*(z*z))));
	
	var wilson = {
		high: (left * (middle + diff)),
		center: ((p + ((1/(2*n))*(z*z))) / (1 + ((1/n)*(z*z)))),
		low: (left * (middle - diff))
	};*/
		
	return wilson;
}

/*
 * Wilson score interval with continuity correction
 *
 * source: http://en.wikipedia.org/wiki/Binomial_proportion_confidence_interval#Wilson_score_interval_with_continuity_correction
 */
exports.cont = function(ups, downs, z) {
	
	var n = ups + downs;	
	if (n <= 0 || n < ups) return 0;

	var z = z || 1.036; // 1.036 = 85%, 1.645 = 95%
	var p = (ups/n);
	
	var high = (((2*n*p)+(z*z)+(z*Math.sqrt((z*z)-(1/n)+(4*n*p*(1-p))-(4*p-2)+1)))/(2*(n+(z*z))));
	var low = (((2*n*p)+(z*z)-(z*Math.sqrt((z*z)-(1/n)+(4*n*p*(1-p))+(4*p-2)+1)))/(2*(n+(z*z))));
	var center = (high+low)/2;
	
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
 * source: https://corplingstats.wordpress.com/2012/04/30/inferential-statistics/
 
exports.adj = function(ups, downs, s, z) {
	
	var n = ups + downs;	
	if (n <= 0 || n < ups) return 0;

	var z = z || 1.036; // 1.036 = 85%, 1.645 = 95%
	var p = (ups/n);
	var v = Math.sqrt(1-n/s);
	
	var left = (p+(z*z)*(v*v)/(2*n));
	var right = (z*Math.sqrt(p*(1-p)*(v*v)/n+(z*z)*(v*v*v*v)/4*(n*n)));
	var top = (left + right);
	var bottom = (1+(z*z)*(v*v)/n);
	
	var high = (((p+(z*z)*(v*v)/(2*n))+(z*Math.sqrt(p*(1-p)*(v*v)/n+(z*z)*(v*v*v*v)/4*(n*n))))/(1+(z*z)*(v*v)/n));
	var low = (((p+(z*z)*(v*v)/(2*n))-(z*Math.sqrt(p*(1-p)*(v*v)/n+(z*z)*(v*v*v*v)/4*(n*n))))/(1+(z*z)*(v*v)/n));;
	var center = (high+low)/2;
	
	var wilson = {
		high: high,
		center: center,
		low: low
	}
	
	return wilson;
}
*/