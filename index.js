module.exports = function(ups, downs, z) {
		
	var n = ups + downs;
	
	if (n <= 0 || n < ups) return 0;
			
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
}