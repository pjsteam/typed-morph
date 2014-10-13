module.exports = wrap;

var create = function(type, items){
  // could be simpler new window[type] but this is faster
  switch(type){
    case 'Uint8Array':
      return new Uint8Array(items);
    case 'Uint8ClampedArray':
      return new Uint8ClampedArray(items);
    case 'Uint16Array':
      return new Uint16Array(items);
    case 'Uint32Array':
      return new Uint32Array(items);
    case 'Int8Array':
      return new Int8Array(items);
    case 'Int16Array':
      return new Int16Array(items);
    case 'Int32Array':
      return new Int32Array(items);
  }
}

var getType = function(it, isView){
  var type = it.type;
  if (isView){
    var temp = it.toString();
    type = temp.substring('[object '.length, temp.length - 1);
  }

  return type;
}

function Iterator(type){
  this.type = type;
}

Iterator.prototype.map = function(f){
  return map(this, f);
};

Iterator.prototype.filter = function(f){
  return filter(this, f);
};

Iterator.prototype.reduce = function(f, init){
  return reduce(this, f, init);
};

Iterator.prototype.col = function(){
  var items = this.reduce(function(current, value){
    current.push(value);
    return current;
  }, []);

  return create(this.type, items);
}

var map = function(it, f) {
  var isView = ArrayBuffer.isView(it);
  var type = getType(it, isView);
  var iterator = isView ? it.values() : it;

  var toReturn = new Iterator(type);
  toReturn.next = function(){
    var current = iterator.next();

    if (current.done) {
      return { done: true };
    }

    return { done: false, value: f(current.value) };
  };

  return toReturn;
}

var filter = function (it, f) {
  var isView = ArrayBuffer.isView(it);
  var type = getType(it, isView);
  var iterator = isView ? it.values() : it;

  var toReturn = new Iterator(type);
  toReturn.next = function(){
    var current = iterator.next();

    while(!current.done && !f(current.value)){
      current = iterator.next();
    }

    return current;
  };

  return toReturn;
}

var reduce = function(it, f, init){
  it = ArrayBuffer.isView(it) ? it.values() : it;
  var elem = it.next();
  var current = init;

  while(!elem.done){
    current = f(current, elem.value);
    elem = it.next();
  }

  return current;
}

function wrap(typedArray){
  return {
    map: function(f){
      return map(typedArray, f);
    },
    filter: function(f){
      return filter(typedArray, f);
    },
    reduce: function(f, init){
      return reduce(typedArray, f, init);
    }
  }
}