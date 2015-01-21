var wilson = require('./index');

console.log('Standard:')
console.log(wilson(73, 100));
console.log('With 97.5% confidence:');
console.log(wilson(73, 100, 0.975));
console.log('With Singleton\'s adjustment and population of 140:');
console.log(wilson(73, 100, false, 140));
console.log('With continuity correction:');
console.log(wilson(73, 100, false, false, true));
