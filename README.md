typed-morph
===========
High order functions (map, reduce, filter) to work with Javascript typed arrays. They don't make use of intermediate arrays for chaining, and instead takes advantage of [the iterator protocol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/The_Iterator_protocol).

# Installing
```
npm i typed-morph
```

# Usage
## map
```javascript
var wrap = require('typed-morph');
var elements = new Uint16Array([1,2,3]);
var mapped = wrap(elements).map(function(e) { return e * 2 }).col();
    
// mapped now is a Uint16Array with [2,4,6] content
```

Alternatively, you can avoid invoking `col` and use the iterator:
```javascript
var wrap = require('typed-morph');
var elements = new Uint16Array([1,2,3]);
// returns an object that matches the JS iterator protocol https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/The_Iterator_protocol
var iterator = wrap(elements).map(function(e) { return e * 2 });
    
console.log(iterator.next()); // { done: false, value: 2 }
```

## filter
```javascript
var wrap = require('typed-morph');
var elements = new Uint16Array([1,2,3,4]);
var filtered = wrap(elements).filter(function(e) { return e % 2 === 0 }).col();
    
// mapped now is a Uint16Array with [2,4] content
```

Alternatively, you can avoid invoking `col` and use the iterator:
```javascript
var wrap = require('typed-morph');
var elements = new Uint16Array([1,2,3,4]);
// returns an object that matches the JS iterator protocol https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/The_Iterator_protocol
var filtered = wrap(elements).filter(function(e) { return e % 2 === 0 });
    
console.log(iterator.next()); // { done: false, value: 2 }
```

## reduce
```javascript
var elements = new Uint16Array([1,2,3,4]);

var sum = wrap(elements).reduce(function(value, current){ return value + current; }, 0);

console.log(sum); // 10
```

## Chaining
Sometimes you need to perform multiple sequential operations on the same array. The `typed-morpth` implementation does not create any intermediate arrays until either `col` or `reduce` are invoked.

For example:
```javascript
var elements = new Uint16Array([1,4,7,10]);
var iter = wrap(elements)
  .map(function(e) { return e + 1; })
  .filter(function(e){ return e % 2 === 0; });

// at this point no processing has taken place
iter.reduce(function(value, current) { return value + current; }, 0);

expect(sum).to.equal(10);
```

# Acknowledgements
* Using [this great seed](https://github.com/mgonto/gulp-browserify-library-seed) project from @mgonto.