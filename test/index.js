'use strict';

var wrap = require('../src/index.js');

describe('map', function(){

  it('should apply function to each element when called', function() {
    var elements = new Uint16Array([1,2,3]);
    var mapped = wrap(elements).map(function(e) { return e * 2 }).col();

    expect(mapped).to.have.length(3);
    expect(mapped[0]).to.equal(2);
    expect(mapped[1]).to.equal(4);
    expect(mapped[2]).to.equal(6);
  });

  ['Int8Array', 'Uint8Array', 'Uint8ClampedArray',
     'Int16Array', 'Uint16Array', 'Int32Array', 'Uint32Array'].forEach(function(type){
      it('should use ' + type + 'array type for mapped array if original is ' + type, function() {
        var elements = new global[type]([1,2,3]);
        var mapped = wrap(elements).map(function(e) { return e * 2 }).col();
        expect(elements).to.be.instanceOf(global[type]);
      });
  });

  it('should return iterator to elements if col is not called', function(){
    var elements = new Uint16Array([1,2,3]);
    var iterator = wrap(elements).map(function(e) { return e * 2 });

    var first = iterator.next();
    expect(first.done).to.be.false;
    expect(first.value).to.equal(2);

    var second = iterator.next();
    expect(second.done).to.be.false;
    expect(second.value).to.equal(4);

    var third = iterator.next();
    expect(third.done).to.be.false;
    expect(third.value).to.equal(6);

    var last = iterator.next();
    expect(last.done).to.be.true;

    var lastAgain = iterator.next();
    expect(last.done).to.be.true;
  });
});


describe('filter', function(){

  it('should only leave elements that match function', function() {
    var elements = new Uint16Array([1,2,3,4]);
    var filtered = wrap(elements).filter(function(e) { return e % 2 === 0 }).col();

    expect(filtered).to.have.length(2);
    expect(filtered[0]).to.equal(2);
    expect(filtered[1]).to.equal(4);
  });

  ['Int8Array', 'Uint8Array', 'Uint8ClampedArray',
     'Int16Array', 'Uint16Array', 'Int32Array', 'Uint32Array'].forEach(function(type){
      it('should use ' + type + 'array type for filtered array if original is ' + type, function() {
        var elements = new global[type]([1,2,3,4]);
        var filtered = wrap(elements).filter(function(e) { return e % 2 === 0 }).col();
        expect(filtered).to.be.instanceOf(global[type]);
      });
  });

  it('should return iterator to elements if col is not called', function(){
    var elements = new Uint16Array([1,2,3,4]);
    var iterator = wrap(elements).filter(function(e) { return e % 2 === 0 });

    var first = iterator.next();
    expect(first.done).to.be.false;
    expect(first.value).to.equal(2);

    var second = iterator.next();
    expect(second.done).to.be.false;
    expect(second.value).to.equal(4);

    var last = iterator.next();
    expect(last.done).to.be.true;

    var lastAgain = iterator.next();
    expect(last.done).to.be.true;
  });
});

describe('reduce', function(){
  it('should be able to add all elements in array', function(){
    var elements = new Uint16Array([1,2,3,4]);

    var sum = wrap(elements).reduce(function(value, current){
      return value + current;
    }, 0);

    expect(sum).to.equal(10);
  });

  it('should be able to add all elements in array with initial value', function(){
    var elements = new Uint16Array([1,2,3,4]);

    var sum = wrap(elements).reduce(function(value, current){
      return value + current;
    }, 10);

    expect(sum).to.equal(20);
  });
});

describe('chaining', function(){
  it ('should be able to filter and then map', function(){
    var elements = new Uint16Array([1,2,3,4]);
    var iterator = wrap(elements)
      .filter(function(e){ return e % 2 === 0; })
      .map(function(e) { return e * 2; });

    var first = iterator.next();
    expect(first.done).to.be.false;
    expect(first.value).to.equal(4);

    var first = iterator.next();
    expect(first.done).to.be.false;
    expect(first.value).to.equal(8);

    var last = iterator.next();
    expect(last.done).to.be.true;

    var lastAgain = iterator.next();
    expect(lastAgain.done).to.be.true;
  });

  it('should be able to map and then filter', function(){
    var elements = new Uint16Array([1,4,7,10]);
    var iterator = wrap(elements)
      .map(function(e) { return e + 1; })
      .filter(function(e){ return e % 2 === 0; });

    var first = iterator.next();
    expect(first.done).to.be.false;
    expect(first.value).to.equal(2);

    var first = iterator.next();
    expect(first.done).to.be.false;
    expect(first.value).to.equal(8);

    var last = iterator.next();
    expect(last.done).to.be.true;

    var lastAgain = iterator.next();
    expect(lastAgain.done).to.be.true;
  });

  it('should be able to map, then filter, then reduce', function(){
    var elements = new Uint16Array([1,4,7,10]);
    var sum = wrap(elements)
      .map(function(e) { return e + 1; })
      .filter(function(e){ return e % 2 === 0; })
      .reduce(function(value, current) { return value + current; }, 0);

    expect(sum).to.equal(10);
  });
});
