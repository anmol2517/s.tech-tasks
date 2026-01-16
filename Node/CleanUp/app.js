const myModule = require('./myModule.js');

console.log(myModule.single());   // "Hello from single function export!"

console.log(myModule.multi.add(5, 3)); 
console.log(myModule.multi.sub(5, 3)); 


console.log(myModule.sayHi());   // "Hi from exports shortcut!"
