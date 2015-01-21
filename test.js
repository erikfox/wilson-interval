var wilson = require('./index');

//console.log('Haven\'t written any, sorry!');
console.log('z = 1.95996:');
console.log(wilson(73, 100));
console.log('z = pnormaldist fn:')
console.log(wilson(73, 100, 1.95996, false, false, 0.975));
