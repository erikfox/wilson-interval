exports.full = function(ups, downs, z) {
		
		var n = ups + downs;
		
		if (n == 0) return 0;
				
		var z = z || 1.036 // 1.036 = 85%, 1.645 = 95%
		
		var p = (ups/n);
		
		var left = (1/(1+((1/n)*(z*z))));
		
		var middle = (p+((1/(2*n))*(z*z)))
		
		var diff = (z * Math.sqrt(((1/n)*p*(1-p))+((1/(4*(n*n)))*(z*z))));
		
		var wilson = {
			high: (left * (middle + diff)),
			center: ((p + ((1/(2*n))*(z*z))) / (1 + ((1/n)*(z*z)))),
			low: (left * (middle - diff))
		};
		
		return wilson;
		
		//[p + z²ν²/2N ± z√p(1 – p)ν²/N + z²ν⁴/4N²] / [1 + z²ν²/N]
		
		//(p + z²ν²/2N ± ( z * ( Math.sqrt( ( p * (1 - p) * (v^2) ) / ( n + ((z^2)*(v^2)) / (4 * (n^2)) ) ) ) ) / (1 + z²ν²/N)
		
		//return Math.sqrt( phat+z*z/(2*n)-z*( (phat*(1-phat)+z*z/(4*n))/n ) ) / ( 1+z*z/n );
	}