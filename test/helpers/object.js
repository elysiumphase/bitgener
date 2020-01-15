const { expect } = require('../Common');
const { object: { exists, is, hasOwn, has, sizeOwn, isEmptyOwn, getType, getTypeName, clone } } = require('../../lib/helpers');

describe('#helpers object', function() {
  context('when using exists', function() {
    it('should return true when testing a string', function() {
      expect(exists('')).to.be.a('boolean').and.to.be.true;
      expect(exists(' ')).to.be.a('boolean').and.to.be.true;
      expect(exists('x')).to.be.a('boolean').and.to.be.true;
      expect(exists("")).to.be.a('boolean').and.to.be.true;
      expect(exists(" ")).to.be.a('boolean').and.to.be.true;
      expect(exists("x")).to.be.a('boolean').and.to.be.true;
      expect(exists(new String(''))).to.be.a('boolean').and.to.be.true;
      expect(exists(new String(' '))).to.be.a('boolean').and.to.be.true;
      expect(exists(new String('x'))).to.be.a('boolean').and.to.be.true;
    });

    it('should return true when testing a number', function() {
      expect(exists(5)).to.be.a('boolean').and.to.be.true;
      expect(exists(5.5)).to.be.a('boolean').and.to.be.true;
      expect(exists(Infinity)).to.be.a('boolean').and.to.be.true;
      expect(exists(0xFF)).to.be.a('boolean').and.to.be.true;
      expect(exists(0b111110111)).to.be.a('boolean').and.to.be.true;
      expect(exists(0o767)).to.be.a('boolean').and.to.be.true;
      expect(exists(new Number('5'))).to.be.a('boolean').and.to.be.true;
    });

    it('should return true when testing a boolean', function() {
      expect(exists(true)).to.be.a('boolean').and.to.be.true;
      expect(exists(false)).to.be.a('boolean').and.to.be.true;
      expect(exists(new Boolean('true'))).to.be.a('boolean').and.to.be.true;
    });

    it('should return true when testing a symbol', function() {
      expect(exists(Symbol('x'))).to.be.a('boolean').and.to.be.true;
    });

    it('should return true when testing a function', function() {
      expect(exists(function f() {})).to.be.a('boolean').and.to.be.true;
    });

    it('should return true when testing an object', function() {
      class c {};
      expect(exists({})).to.be.a('boolean').and.to.be.true;
      expect(exists({ x: 5 })).to.be.a('boolean').and.to.be.true;
      expect(exists(c)).to.be.a('boolean').and.to.be.true;
    });

    it('should return true when testing an error', function() {
      expect(exists(new Error('error'))).to.be.a('boolean').and.to.be.true;
    });

    it('should return true when testing a date', function() {
      expect(exists(Date.now())).to.be.a('boolean').and.to.be.true;
      expect(exists(new Date())).to.be.a('boolean').and.to.be.true;
    });

    it('should return true when testing an array', function() {
      expect(exists([])).to.be.a('boolean').and.to.be.true;
      expect(exists([5])).to.be.a('boolean').and.to.be.true;
      expect(exists(new Array())).to.be.a('boolean').and.to.be.true;
      expect(exists(new Array(0))).to.be.a('boolean').and.to.be.true;
    });

    it('should return true when testing a map', function() {
      expect(exists(new Map())).to.be.a('boolean').and.to.be.true;
    });

    it('should return true when testing a set', function() {
      expect(exists(new Set())).to.be.a('boolean').and.to.be.true;
    });

    it('should return true when testing a weakmap', function() {
      expect(exists(new WeakMap())).to.be.a('boolean').and.to.be.true;
    });

    it('should return true when testing a weakset', function() {
      expect(exists(new WeakSet())).to.be.a('boolean').and.to.be.true;
    });

    it('should return false when testing undefined', function() {
      expect(exists(undefined)).to.be.a('boolean').and.to.be.false;
    });

    it('should return false when testing NaN', function() {
      expect(exists(NaN)).to.be.a('boolean').and.to.be.false;
    });

    it('should return false when testing null', function() {
      expect(exists(null)).to.be.a('boolean').and.to.be.false;
    });
  });

  context('when using is', function() {
    it('should return true when testing a string', function() {
      expect(is(String, '')).to.be.a('boolean').and.to.be.true;
      expect(is(String, ' ')).to.be.a('boolean').and.to.be.true;
      expect(is(String, 'x')).to.be.a('boolean').and.to.be.true;
      expect(is(String, "")).to.be.a('boolean').and.to.be.true;
      expect(is(String, " ")).to.be.a('boolean').and.to.be.true;
      expect(is(String, "x")).to.be.a('boolean').and.to.be.true;
      expect(is(String, new String(''))).to.be.a('boolean').and.to.be.true;
      expect(is(String, new String(' '))).to.be.a('boolean').and.to.be.true;
      expect(is(String, new String('x'))).to.be.a('boolean').and.to.be.true;
    });

    it('should return true when testing a number', function() {
      expect(is(Number, 5)).to.be.a('boolean').and.to.be.true;
      expect(is(Number, 5.5)).to.be.a('boolean').and.to.be.true;
      expect(is(Number, Infinity)).to.be.a('boolean').and.to.be.true;
      expect(is(Number, 0xFF)).to.be.a('boolean').and.to.be.true;
      expect(is(Number, 0b111110111)).to.be.a('boolean').and.to.be.true;
      expect(is(Number, 0o767)).to.be.a('boolean').and.to.be.true;
      expect(is(Number, new Number('5'))).to.be.a('boolean').and.to.be.true;
    });

    it('should return true when testing a boolean', function() {
      expect(is(Boolean, true)).to.be.a('boolean').and.to.be.true;
      expect(is(Boolean, false)).to.be.a('boolean').and.to.be.true;
      expect(is(Boolean, new Boolean('true'))).to.be.a('boolean').and.to.be.true;
    });

    it('should return true when testing a symbol', function() {
      expect(is(Symbol, Symbol('x'))).to.be.a('boolean').and.to.be.true;
    });

    it('should return true when testing a function', function() {
      expect(is(Function, function f() {})).to.be.a('boolean').and.to.be.true;
    });

    it('should return true when testing an object', function() {
      class c {};
      expect(is(Object, {})).to.be.a('boolean').and.to.be.true;
      expect(is(Object, { x: 5 })).to.be.a('boolean').and.to.be.true;
      expect(is(Object, c)).to.be.a('boolean').and.to.be.true;
    });

    it('should return true when testing an error', function() {
      expect(is(Error, new Error('error'))).to.be.a('boolean').and.to.be.true;
    });

    it('should return true when testing a date', function() {
      expect(is(Date, new Date())).to.be.a('boolean').and.to.be.true;
    });

    it('should return true when testing an array', function() {
      expect(is(Array, [])).to.be.a('boolean').and.to.be.true;
      expect(is(Array, [5])).to.be.a('boolean').and.to.be.true;
      expect(is(Array, new Array())).to.be.a('boolean').and.to.be.true;
      expect(is(Array, new Array(0))).to.be.a('boolean').and.to.be.true;
    });

    it('should return true when testing a map', function() {
      expect(is(Map, new Map())).to.be.a('boolean').and.to.be.true;
    });

    it('should return true when testing a set', function() {
      expect(is(Set, new Set())).to.be.a('boolean').and.to.be.true;
    });

    it('should return true when testing a weakmap', function() {
      expect(is(WeakMap, new WeakMap())).to.be.a('boolean').and.to.be.true;
    });

    it('should return true when testing a weakset', function() {
      expect(is(WeakSet, new WeakSet())).to.be.a('boolean').and.to.be.true;
    });

    it('should return false when testing NaN to be a Number', function() {
      expect(is(Number, NaN)).to.be.a('boolean').and.to.be.false;
    });

    it('should return false when the type does not exist', function() {
      expect(is(undefined, '')).to.be.a('boolean').and.to.be.false;
      expect(is(NaN, '')).to.be.a('boolean').and.to.be.false;
      expect(is(null, '')).to.be.a('boolean').and.to.be.false;
    });

    it('should return false when the value does not exist', function() {
      expect(is(String, undefined)).to.be.a('boolean').and.to.be.false;
      expect(is(String, NaN)).to.be.a('boolean').and.to.be.false;
      expect(is(String, null)).to.be.a('boolean').and.to.be.false;
    });

    it('should return false when both type and value don\'t exist', function() {
      expect(is(undefined, undefined)).to.be.a('boolean').and.to.be.false;
      expect(is(undefined, NaN)).to.be.a('boolean').and.to.be.false;
      expect(is(undefined, null)).to.be.a('boolean').and.to.be.false;
      expect(is(NaN, undefined)).to.be.a('boolean').and.to.be.false;
      expect(is(NaN, NaN)).to.be.a('boolean').and.to.be.false;
      expect(is(NaN, null)).to.be.a('boolean').and.to.be.false;
      expect(is(null, undefined)).to.be.a('boolean').and.to.be.false;
      expect(is(null, NaN)).to.be.a('boolean').and.to.be.false;
      expect(is(null, null)).to.be.a('boolean').and.to.be.false;
    });
  });

  context('when using hasOwn', function() {
    const symbol = Symbol('x');
    const o1 = { p1: 5, p2: { p3: 9 }, [symbol]: 15 };
    const o2 = function () {};
    o2.p1 = 5;
    o2.prototype.p3 = 9;
    class C {
      constructor() { this.p1 = 5 }
      m() {}
    };
    const o3 = new C;

    it('should return true when an object has the specified property as its own property (as opposed to inheriting it)', function() {
      expect(hasOwn(o1, 'p1')).to.be.a('boolean').and.to.be.true;
      expect(hasOwn(o1, 'p2')).to.be.a('boolean').and.to.be.true;
      expect(hasOwn(o1, symbol)).to.be.a('boolean').and.to.be.true;
      expect(hasOwn(o2, 'p1')).to.be.a('boolean').and.to.be.true;
      expect(hasOwn(o3, 'p1')).to.be.a('boolean').and.to.be.true;
    });

    it('should return false when an object has not the specified property as its own property', function() {
      expect(hasOwn(o1, 'p3')).to.be.a('boolean').and.to.be.false;
      expect(hasOwn(o1, 'px')).to.be.a('boolean').and.to.be.false;
      expect(hasOwn(o2, 'p3')).to.be.a('boolean').and.to.be.false;
      expect(hasOwn(o2, 'px')).to.be.a('boolean').and.to.be.false;
      expect(hasOwn(o3, 'm')).to.be.a('boolean').and.to.be.false;
      expect(hasOwn(o3, 'px')).to.be.a('boolean').and.to.be.false;
    });

    it('should return false when the object does not exist', function() {
      expect(hasOwn(undefined, '')).to.be.a('boolean').and.to.be.false;
      expect(hasOwn(NaN, '')).to.be.a('boolean').and.to.be.false;
      expect(hasOwn(null, '')).to.be.a('boolean').and.to.be.false;
    });

    it('should return false when the property does not exist', function() {
      expect(hasOwn({}, undefined)).to.be.a('boolean').and.to.be.false;
      expect(hasOwn({}, NaN)).to.be.a('boolean').and.to.be.false;
      expect(hasOwn({}, null)).to.be.a('boolean').and.to.be.false;
    });

    it('should return false when both object and property don\'t exist', function() {
      expect(hasOwn(undefined, undefined)).to.be.a('boolean').and.to.be.false;
      expect(hasOwn(undefined, NaN)).to.be.a('boolean').and.to.be.false;
      expect(hasOwn(undefined, null)).to.be.a('boolean').and.to.be.false;
      expect(hasOwn(NaN, undefined)).to.be.a('boolean').and.to.be.false;
      expect(hasOwn(NaN, NaN)).to.be.a('boolean').and.to.be.false;
      expect(hasOwn(NaN, null)).to.be.a('boolean').and.to.be.false;
      expect(hasOwn(null, undefined)).to.be.a('boolean').and.to.be.false;
      expect(hasOwn(null, NaN)).to.be.a('boolean').and.to.be.false;
      expect(hasOwn(null, null)).to.be.a('boolean').and.to.be.false;
    });
  });

  context('when using has', function() {
    const o1 = { p1: 5, p2: { p3: 9 } };
    const o2 = function () {};
    o2.p1 = 5;
    o2.prototype.p3 = 9;
    class C {
      constructor() { this.p1 = 5 }
      m() {}
    };
    const o3 = new C;

    it('should return true when an object has the specified property as its own property or inheriting ones', function() {
      expect(has(o1, 'p1')).to.be.a('boolean').and.to.be.true;
      expect(has(o1, 'p2')).to.be.a('boolean').and.to.be.true;
      expect(has(o2, 'p1')).to.be.a('boolean').and.to.be.true;
      expect(has(o2, 'p3')).to.be.a('boolean').and.to.be.true;
      expect(has(o3, 'p1')).to.be.a('boolean').and.to.be.true;
      expect(has(o3, 'm')).to.be.a('boolean').and.to.be.true;
    });

    it('should return false when an object is a function constructor with no prototype', function() {
      const o = function () {};
      o.prototype = undefined;
      expect(has(o, '')).to.be.a('boolean').and.to.be.false;
      o.prototype = NaN;
      expect(has(o, '')).to.be.a('boolean').and.to.be.false;
      o.prototype = null;
      expect(has(o, '')).to.be.a('boolean').and.to.be.false;
    });

    it('should return false when an object has not the specified property', function() {
      expect(has(o1, 'px')).to.be.a('boolean').and.to.be.false;
      expect(has(o2, 'px')).to.be.a('boolean').and.to.be.false;
      expect(has(o3, 'px')).to.be.a('boolean').and.to.be.false;
    });

    it('should return false when the object does not exist', function() {
      expect(has(undefined, '')).to.be.a('boolean').and.to.be.false;
      expect(has(NaN, '')).to.be.a('boolean').and.to.be.false;
      expect(has(null, '')).to.be.a('boolean').and.to.be.false;
    });

    it('should return false when the property does not exist', function() {
      expect(has({}, undefined)).to.be.a('boolean').and.to.be.false;
      expect(has({}, NaN)).to.be.a('boolean').and.to.be.false;
      expect(has({}, null)).to.be.a('boolean').and.to.be.false;
    });

    it('should return false when both object and property don\'t exist', function() {
      expect(has(undefined, undefined)).to.be.a('boolean').and.to.be.false;
      expect(has(undefined, NaN)).to.be.a('boolean').and.to.be.false;
      expect(has(undefined, null)).to.be.a('boolean').and.to.be.false;
      expect(has(NaN, undefined)).to.be.a('boolean').and.to.be.false;
      expect(has(NaN, NaN)).to.be.a('boolean').and.to.be.false;
      expect(has(NaN, null)).to.be.a('boolean').and.to.be.false;
      expect(has(null, undefined)).to.be.a('boolean').and.to.be.false;
      expect(has(null, NaN)).to.be.a('boolean').and.to.be.false;
      expect(has(null, null)).to.be.a('boolean').and.to.be.false;
    });
  });

  context('when using sizeOwn', function() {
    context('when the object is a literal', function() {
      const o1 = { p1: 5, p2: { p3: 9 } };
      class C {
        constructor() { this.p1 = 5 }
        m() {}
      };
      const o2 = new C;
      const o3 = {};

      it('should return the number of the object own properties (as opposed to inheriting ones)', function() {
        expect(sizeOwn(o1)).to.be.a('number').and.to.equals(2);
        expect(sizeOwn(o2)).to.be.a('number').and.to.equals(1);
        expect(sizeOwn(o3)).to.be.a('number').and.to.equals(0);
      });
    });

    context('when the object is an object from a function', function() {
      const o = function () {};
      o.p1 = 5;
      o.prototype.p3 = 9;

      it('should return the number of the object own properties (as opposed to inheriting ones) and not the length of the function that always equals 0', function() {
        expect(sizeOwn(o)).to.be.a('number').and.to.equals(1);
      });
    });

    context('when the object is an array', function() {
      it('should return the length of the array', function() {
        expect(sizeOwn([])).to.be.a('number').and.to.equals(0);
        expect(sizeOwn([5, 5, 5, 5, 5])).to.be.a('number').and.to.equals(5);
      });
    });

    context('when the object is a string', function() {
      it('should return the length of the string', function() {
        expect(sizeOwn('')).to.be.a('number').and.to.equals(0);
        expect(sizeOwn('hello')).to.be.a('number').and.to.equals(5);
      });

      it('should ignore white spaces before and after all other characters', function() {
        expect(sizeOwn('      ')).to.be.a('number').and.to.equals(0);
        expect(sizeOwn('  hello  ')).to.be.a('number').and.to.equals(5);
      });
    });

    context('when the object is a map', function() {
      it('should return the length of the map', function() {
        expect(sizeOwn(new Map())).to.be.a('number').and.to.equals(0);
        expect(sizeOwn(new Map([["key1", "value1"], ["key2", "value2"]]))).to.be.a('number').and.to.equals(2);
      });
    });

    context('when the object is a set', function() {
      it('should return the length of the set', function() {
        expect(sizeOwn(new Set())).to.be.a('number').and.to.equals(0);
        expect(sizeOwn(new Set([1, 2, 3, 4, 5]))).to.be.a('number').and.to.equals(5);
      });
    });

    context('when the object or value has no length or size', function() {
      it('should return 0', function() {
        expect(sizeOwn(new WeakMap())).to.be.a('number').and.to.equals(0);
        expect(sizeOwn(new WeakSet())).to.be.a('number').and.to.equals(0);
      });
    });

    context('when the object does not exist', function() {
      it('should return 0', function() {
        expect(sizeOwn(undefined)).to.be.a('number').and.to.equals(0);
        expect(sizeOwn(NaN)).to.be.a('number').and.to.equals(0);
        expect(sizeOwn(null)).to.be.a('number').and.to.equals(0);
      });
    });
  });

  context('when using isEmptyOwn', function() {
    context('when the object is a literal', function() {
      it('should return false if the object has own properties (as opposed to inheriting ones)', function() {
        const o1 = { p1: 5, p2: { p3: 9 } };
        class C {
          constructor() { this.p1 = 5 }
          m() {}
        };
        const o2 = new C;

        expect(isEmptyOwn(o1)).to.be.a('boolean').and.to.be.false;
        expect(isEmptyOwn(o2)).to.be.a('boolean').and.to.be.false;
      });

      it('should return true if the object has no own properties (as opposed to inheriting ones)', function() {
        expect(isEmptyOwn({})).to.be.a('boolean').and.to.be.true;
      });
    });

    context('when the object is an object from a function', function() {
      it('should return false if the object has own properties (as opposed to inheriting ones)', function() {
        const o = function () {};
        o.p1 = 5;
        o.prototype.p3 = 9;

        expect(isEmptyOwn(o)).to.be.a('boolean').and.to.be.false;
      });

      it('should return true if the object has no own properties (as opposed to inheriting ones)', function() {
        const o = function () {};
        o.prototype.p3 = 9;

        expect(isEmptyOwn(o)).to.be.a('boolean').and.to.be.true;
      });
    });

    context('when the object is an array', function() {
      it('should return true if the array is empty', function() {
        expect(isEmptyOwn([])).to.be.a('boolean').and.to.be.true;
      });

      it('should return false if the array is not empty', function() {
        expect(isEmptyOwn([5, 5, 5, 5, 5])).to.be.a('boolean').and.to.be.false;
      });
    });

    context('when the object is a string', function() {
      it('should return true if the string is empty (whitespaces included)', function() {
        expect(isEmptyOwn('')).to.be.a('boolean').and.to.be.true;
        expect(isEmptyOwn('     ')).to.be.a('boolean').and.to.be.true;
      });

      it('should return false if the string is not empty', function() {
        expect(isEmptyOwn('hello')).to.be.a('boolean').and.to.be.false;
        expect(isEmptyOwn('hello world')).to.be.a('boolean').and.to.be.false;
        expect(isEmptyOwn('  hello world  ')).to.be.a('boolean').and.to.be.false;
      });
    });

    context('when the object is a map', function() {
      it('should return true if the map is empty', function() {
        expect(isEmptyOwn(new Map())).to.be.a('boolean').and.to.be.true;
      });

      it('should return false if the map is not empty', function() {
        expect(isEmptyOwn(new Map([["key1", "value1"], ["key2", "value2"]]))).to.be.a('boolean').and.to.be.false;
      });
    });

    context('when the object is a set', function() {
      it('should return true if the set is empty', function() {
        expect(isEmptyOwn(new Set())).to.be.a('boolean').and.to.be.true;
      });

      it('should return false if the set is not empty', function() {
        expect(isEmptyOwn(new Set([1, 2, 3, 4, 5]))).to.be.a('boolean').and.to.be.false;
      });
    });

    context('when the object does not exist', function() {
      it('should return true', function() {
        expect(isEmptyOwn(undefined)).to.be.a('boolean').and.to.be.true;
        expect(isEmptyOwn(NaN)).to.be.a('boolean').and.to.be.true;
        expect(isEmptyOwn(null)).to.be.a('boolean').and.to.be.true;
      });
    });
  });

  context('when using getType', function() {
    it('should return a function when testing a constructor', function() {
      expect(getType(String)).to.be.a('function').and.to.equals(Function);
      expect(getType(Number)).to.be.a('function').and.to.equals(Function);
      expect(getType(Boolean)).to.be.a('function').and.to.equals(Function);
      expect(getType(Function)).to.be.a('function').and.to.equals(Function);
      expect(getType(Symbol)).to.be.a('function').and.to.equals(Function);
      expect(getType(Object)).to.be.a('function').and.to.equals(Function);
      expect(getType(Error)).to.be.a('function').and.to.equals(Function);
      expect(getType(Date)).to.be.a('function').and.to.equals(Function);
      expect(getType(Array)).to.be.a('function').and.to.equals(Function);
      expect(getType(Map)).to.be.a('function').and.to.equals(Function);
      expect(getType(WeakMap)).to.be.a('function').and.to.equals(Function);
      expect(getType(Set)).to.be.a('function').and.to.equals(Function);
      expect(getType(WeakSet)).to.be.a('function').and.to.equals(Function);
    });

    it('should return the String function when testing a string', function() {
      expect(getType('')).to.be.a('function').and.to.equals(String);
      expect(getType(' ')).to.be.a('function').and.to.equals(String);
      expect(getType('x')).to.be.a('function').and.to.equals(String);
      expect(getType("")).to.be.a('function').and.to.equals(String);
      expect(getType(" ")).to.be.a('function').and.to.equals(String);
      expect(getType("x")).to.be.a('function').and.to.equals(String);
      expect(getType(new String(''))).to.be.a('function').and.to.equals(String);
      expect(getType(new String(' '))).to.be.a('function').and.to.equals(String);
      expect(getType(new String('x'))).to.be.a('function').and.to.equals(String);
    });

    it('should return the Number when testing a number', function() {
      expect(getType(5)).to.be.a('function').and.to.equals(Number);
      expect(getType(5.5)).to.be.a('function').and.to.equals(Number);
      expect(getType(Infinity)).to.be.a('function').and.to.equals(Number);
      expect(getType(0xFF)).to.be.a('function').and.to.equals(Number);
      expect(getType(0b111110111)).to.be.a('function').and.to.equals(Number);
      expect(getType(0o767)).to.be.a('function').and.to.equals(Number);
      expect(getType(new Number('5'))).to.be.a('function').and.to.equals(Number);
    });

    it('should return the Boolean function when testing a boolean', function() {
      expect(getType(true)).to.be.a('function').and.to.equals(Boolean);
      expect(getType(false)).to.be.a('function').and.to.equals(Boolean);
      expect(getType(new Boolean('true'))).to.be.a('function').and.to.equals(Boolean);
    });

    it('should return the Function function when testing a function', function() {
      expect(getType(function f() {})).to.be.a('function').and.to.equals(Function);
      expect(getType(() => {})).to.be.a('function').and.to.equals(Function);
    });

    it('should return the Function function when testing a class', function() {
      expect(getType(class c {})).to.be.a('function').and.to.equals(Function);
      expect(getType(class c { constructor() { this.x = 5 } })).to.be.a('function').and.to.equals(Function);
    });

    it('should return the Symbol function when testing a symbol', function() {
      expect(getType(Symbol('x'))).to.be.a('function').and.to.equals(Symbol);
    });

    it('should return the Object function when testing an object', function() {
      expect(getType({})).to.be.a('function').and.to.equals(Object);
      expect(getType({ x: 5 })).to.be.a('function').and.to.equals(Object);
      expect(getType(Object())).to.be.a('function').and.to.equals(Object);
      expect(getType(new Object())).to.be.a('function').and.to.equals(Object);
    });

    it('should return the Error function when testing an error', function() {
      expect(getType(new Error('error'))).to.be.a('function').and.to.equals(Error);
    });

    it('should return the Date function when testing a date', function() {
      expect(getType(new Date())).to.be.a('function').and.to.equals(Date);
    });

    it('should return the Array function when testing an array', function() {
      expect(getType([])).to.be.a('function').and.to.equals(Array);
      expect(getType([5])).to.be.a('function').and.to.equals(Array);
      expect(getType(new Array())).to.be.a('function').and.to.equals(Array);
      expect(getType(new Array(0))).to.be.a('function').and.to.equals(Array);
    });

    it('should return the Map function when testing a map', function() {
      expect(getType(new Map())).to.be.a('function').and.to.equals(Map);
    });

    it('should return the Set function when testing a set', function() {
      expect(getType(new Set())).to.be.a('function').and.to.equals(Set);
    });

    it('should return the WeakMap function when testing a weakmap', function() {
      expect(getType(new WeakMap())).to.be.a('function').and.to.equals(WeakMap);
    });

    it('should return the WeakSet function when testing a weakset', function() {
      expect(getType(new WeakSet())).to.be.a('function').and.to.equals(WeakSet);
    });

    it('should return undefined when testing undefined', function() {
      expect(getType(undefined)).to.be.undefined;
    });

    it('should return undefined when testing NaN', function() {
      expect(getType(NaN)).to.be.undefined;
    });

    it('should return undefined when testing null', function() {
      expect(getType(null)).to.be.undefined;
    });

    it('should return undefined when testing nothing', function() {
      expect(getType()).to.be.undefined;
    });
  });

  context('when using getTypeName', function() {
    it('should return a function when testing a constructor', function() {
      expect(getTypeName(String)).to.be.a('string').and.to.equals('Function');
      expect(getTypeName(Number)).to.be.a('string').and.to.equals('Function');
      expect(getTypeName(Boolean)).to.be.a('string').and.to.equals('Function');
      expect(getTypeName(Function)).to.be.a('string').and.to.equals('Function');
      expect(getTypeName(Symbol)).to.be.a('string').and.to.equals('Function');
      expect(getTypeName(Object)).to.be.a('string').and.to.equals('Function');
      expect(getTypeName(Error)).to.be.a('string').and.to.equals('Function');
      expect(getTypeName(Date)).to.be.a('string').and.to.equals('Function');
      expect(getTypeName(Array)).to.be.a('string').and.to.equals('Function');
      expect(getTypeName(Map)).to.be.a('string').and.to.equals('Function');
      expect(getTypeName(WeakMap)).to.be.a('string').and.to.equals('Function');
      expect(getTypeName(Set)).to.be.a('string').and.to.equals('Function');
      expect(getTypeName(WeakSet)).to.be.a('string').and.to.equals('Function');
    });

    it('should return the String function when testing a string', function() {
      expect(getTypeName('')).to.be.a('string').and.to.equals('String');
      expect(getTypeName(' ')).to.be.a('string').and.to.equals('String');
      expect(getTypeName('x')).to.be.a('string').and.to.equals('String');
      expect(getTypeName("")).to.be.a('string').and.to.equals('String');
      expect(getTypeName(" ")).to.be.a('string').and.to.equals('String');
      expect(getTypeName("x")).to.be.a('string').and.to.equals('String');
      expect(getTypeName(new String(''))).to.be.a('string').and.to.equals('String');
      expect(getTypeName(new String(' '))).to.be.a('string').and.to.equals('String');
      expect(getTypeName(new String('x'))).to.be.a('string').and.to.equals('String');
    });

    it('should return the Number when testing a number', function() {
      expect(getTypeName(5)).to.be.a('string').and.to.equals('Number');
      expect(getTypeName(5.5)).to.be.a('string').and.to.equals('Number');
      expect(getTypeName(Infinity)).to.be.a('string').and.to.equals('Number');
      expect(getTypeName(0xFF)).to.be.a('string').and.to.equals('Number');
      expect(getTypeName(0b111110111)).to.be.a('string').and.to.equals('Number');
      expect(getTypeName(0o767)).to.be.a('string').and.to.equals('Number');
      expect(getTypeName(new Number('5'))).to.be.a('string').and.to.equals('Number');
    });

    it('should return the Boolean function when testing a boolean', function() {
      expect(getTypeName(true)).to.be.a('string').and.to.equals('Boolean');
      expect(getTypeName(false)).to.be.a('string').and.to.equals('Boolean');
      expect(getTypeName(new Boolean('true'))).to.be.a('string').and.to.equals('Boolean');
    });

    it('should return the Function function when testing a function', function() {
      expect(getTypeName(function f() {})).to.be.a('string').and.to.equals('Function');
      expect(getTypeName(() => {})).to.be.a('string').and.to.equals('Function');
    });

    it('should return the Function function when testing a class', function() {
      expect(getTypeName(class c {})).to.be.a('string').and.to.equals('Function');
      expect(getTypeName(class c { constructor() { this.x = 5 } })).to.be.a('string').and.to.equals('Function');
    });

    it('should return the Symbol function when testing a symbol', function() {
      expect(getTypeName(Symbol('x'))).to.be.a('string').and.to.equals('Symbol');
    });

    it('should return the Object function when testing an object', function() {
      expect(getTypeName({})).to.be.a('string').and.to.equals('Object');
      expect(getTypeName({ x: 5 })).to.be.a('string').and.to.equals('Object');
      expect(getTypeName(Object())).to.be.a('string').and.to.equals('Object');
      expect(getTypeName(new Object())).to.be.a('string').and.to.equals('Object');
    });

    it('should return the Error function when testing an error', function() {
      expect(getTypeName(new Error('error'))).to.be.a('string').and.to.equals('Error');
    });

    it('should return the Date function when testing a date', function() {
      expect(getTypeName(new Date())).to.be.a('string').and.to.equals('Date');
    });

    it('should return the Array function when testing an array', function() {
      expect(getTypeName([])).to.be.a('string').and.to.equals('Array');
      expect(getTypeName([5])).to.be.a('string').and.to.equals('Array');
      expect(getTypeName(new Array())).to.be.a('string').and.to.equals('Array');
      expect(getTypeName(new Array(0))).to.be.a('string').and.to.equals('Array');
    });

    it('should return the Map function when testing a map', function() {
      expect(getTypeName(new Map())).to.be.a('string').and.to.equals('Map');
    });

    it('should return the Set function when testing a set', function() {
      expect(getTypeName(new Set())).to.be.a('string').and.to.equals('Set');
    });

    it('should return the WeakMap function when testing a weakmap', function() {
      expect(getTypeName(new WeakMap())).to.be.a('string').and.to.equals('WeakMap');
    });

    it('should return the WeakSet function when testing a weakset', function() {
      expect(getTypeName(new WeakSet())).to.be.a('string').and.to.equals('WeakSet');
    });

    it('should return undefined when testing undefined', function() {
      expect(getTypeName(undefined)).to.be.undefined;
    });

    it('should return undefined when testing NaN', function() {
      expect(getTypeName(NaN)).to.be.undefined;
    });

    it('should return undefined when testing null', function() {
      expect(getTypeName(null)).to.be.undefined;
    });

    it('should return undefined when testing nothing', function() {
      expect(getTypeName()).to.be.undefined;
    });
  });

  context('when using clone', function() {
    const addPropXYZEquals5 = function addPropXYZEquals5(thing) {
      if (exists(thing)) {
        thing.XYZ = 5;
      }
    };

    context('when cloning strings', function() {
      it('should clone a primitive string', function() {
        expect(clone('')).to.be.a('string').and.to.equals('');
        expect(clone(' ')).to.be.a('string').and.to.equals(' ');
        expect(clone('x')).to.be.a('string').and.to.equals('x');
        expect(clone("")).to.be.a('string').and.to.equals("");
        expect(clone(" ")).to.be.a('string').and.to.equals(" ");
        expect(clone("x")).to.be.a('string').and.to.equals("x");

        expect(clone(String(''))).to.be.a('string').and.to.equals('');
        expect(clone(String(' '))).to.be.a('string').and.to.equals(' ');
        expect(clone(String('x'))).to.be.a('string').and.to.equals('x');
        expect(clone(String(""))).to.be.a('string').and.to.equals("");
        expect(clone(String(" "))).to.be.a('string').and.to.equals(" ");
        expect(clone(String("x"))).to.be.a('string').and.to.equals("x");

        const original = 's';
        addPropXYZEquals5(original);
        const copy = clone(original);

        expect(copy).to.be.a('string').and.to.equals('s');
        expect(copy.XYZ).to.be.undefined;
      });

      it('should clone a string object when a string has been built with String as constructor', function() {
        const original = new String('origin');

        addPropXYZEquals5(original);
        original[6] = true;

        const copy = clone(original);

        expect(copy).to.be.a('string').and.to.not.equals(original);
        expect(copy.valueOf()).to.be.a('string').and.to.equals('origin');
        expect(copy.XYZ).to.equals(5);
        expect(copy[6]).to.equals(true);
        expect(copy.length).to.equals(6);
      });
    });

    context('when cloning numbers', function() {
      it('should clone a primitive number', function() {
        expect(clone(5)).to.be.a('number').and.to.equals(5);
        expect(clone(5.5)).to.be.a('number').and.to.equals(5.5);
        expect(clone(Infinity)).to.be.a('number').and.to.equals(Infinity);
        expect(clone(0xFF)).to.be.a('number').and.to.equals(0xFF);
        expect(clone(0b111110111)).to.be.a('number').and.to.equals(0b111110111);
        expect(clone(0o767)).to.be.a('number').and.to.equals(0o767);

        expect(clone(Number(5))).to.be.a('number').and.to.equals(5);
        expect(clone(Number(5.5))).to.be.a('number').and.to.equals(5.5);
        expect(clone(Number(Infinity))).to.be.a('number').and.to.equals(Infinity);
        expect(clone(Number(0xFF))).to.be.a('number').and.to.equals(0xFF);
        expect(clone(Number(0b111110111))).to.be.a('number').and.to.equals(0b111110111);
        expect(clone(Number(0o767))).to.be.a('number').and.to.equals(0o767);

        const original = 5;
        addPropXYZEquals5(original);
        const copy = clone(original);

        expect(copy).to.be.a('number').and.to.equals(5);
        expect(copy.XYZ).to.be.undefined;
      });

      it('should clone a number object when a number has been built with Number as constructor', function() {
        const original = new Number(5);

        addPropXYZEquals5(original);

        const copy = clone(original);

        expect(copy).to.be.a('number').and.to.not.equals(original);
        expect(copy.valueOf()).to.be.a('number').and.to.equals(5);
        expect(copy.XYZ).to.equals(5);
      });
    });

    context('when cloning booleans', function() {
      it('should clone a primitive boolean', function() {
        expect(clone(true)).to.be.a('boolean').and.to.equals(true);
        expect(clone(false)).to.be.a('boolean').and.to.equals(false);

        const original = true;
        addPropXYZEquals5(original);
        const copy = clone(original);

        expect(copy).to.be.a('boolean').and.to.equals(true);
        expect(copy.XYZ).to.be.undefined;
      });

      it('should clone a boolean object when a boolean has been built with Boolean as constructor', function() {
        const original = new Boolean(true);

        addPropXYZEquals5(original);

        const copy = clone(original);

        expect(copy).to.be.a('boolean').and.to.not.equals(original);
        expect(copy.valueOf()).to.be.a('boolean').and.to.equals(true);
        expect(copy.XYZ).to.equals(5);
      });
    });

    context('when cloning symbols', function() {
      it('should clone a primitive symbol only', function() {
        const original = Symbol('s');

        addPropXYZEquals5(original);

        const copy = clone(original);

        expect(copy).to.be.a('symbol');
        expect(copy).to.equals(original);
        expect(original.XYZ).to.be.undefined;
        expect(copy.XYZ).to.be.undefined;
      });
    });

    context('when cloning arrays', function() {
      it('should clone the specified array', function() {
        const original1 = [0, 1, 2];
        const copy1 = clone(original1);

        expect(copy1).to.be.an('array').and.to.have.length(3).and.to.not.equals(original1);
        expect(copy1[0]).to.equals(0);
        expect(copy1[1]).to.equals(1);
        expect(copy1[2]).to.equals(2);

        const original2 = new Array();
        const copy2 = clone(original2);

        expect(copy2).to.be.an('array').and.to.have.length(0).and.to.not.equals(original2);
      });
    });

    context('when cloning arraybuffers', function() {
      it('should clone the specified arraybuffer', function() {
        const original = new ArrayBuffer(8);
        const copy = clone(original);

        expect(copy).to.be.an('arraybuffer').and.to.not.equals(original);
        expect(copy.byteLength).to.equals(8);
      });
    });

    context('when cloning buffers', function() {
      it('should clone the specified buffer', function() {
        const original = Buffer.from('buff', 'utf8');
        const copy = clone(original);

        expect(Buffer.isBuffer(copy)).to.be.true;
        expect(copy).to.not.equals(original); // check not sharing same reference
        expect(original.byteLength).to.equals(4);
        expect(copy.byteLength).to.equals(4);
        expect(copy.equals(original)).to.be.true; // check same bytes
        expect(copy.toString()).to.be.equals('buff');
      });
    });

    context('when cloning dataviews', function() {
      it('should clone the specified dataview', function() {
        const buffer = new ArrayBuffer(16);
        const original = new DataView(buffer);
        const copy = clone(original);

        expect(copy).to.be.a('dataview').and.to.not.equals(original);
        expect(copy.buffer.byteLength).to.equals(original.buffer.byteLength);
        expect(copy.byteLength).to.equals(original.byteLength);
        expect(copy.byteOffset).to.equals(original.byteOffset);
      });
    });

    context('when cloning dates', function() {
      it('should clone the specified date', function() {
        const original = new Date();
        const copy = clone(original);

        expect(copy).to.be.a('date').and.to.not.equals(original);
        expect(copy.valueOf()).to.equals(original.valueOf());
      });
    });

    context('when cloning errors', function() {
      it('should clone the specified error', function() {
        const original = new Error('error found');
        const copy = clone(original);

        expect(copy).to.be.an('error').and.to.not.equals(original);
        expect(copy.message).to.equals(original.message);
        expect(copy.name).to.equals(original.name);
        expect(copy.stack).to.equals(original.stack);
      });
    });

    context('when cloning evalerrors', function() {
      it('should clone the specified evalerror', function() {
        const original = new EvalError('error found');
        const copy = clone(original);

        expect(copy.constructor).to.equals(EvalError);
        expect(copy).to.not.equals(original);
        expect(copy.message).to.equals(original.message);
        expect(copy.name).to.equals(original.name);
        expect(copy.stack).to.equals(original.stack);
      });
    });

    context('when cloning float32arrays', function() {
      it('should clone the specified float32array', function() {
        const original1 = new Float32Array([5, 9]);
        const original2 = new Float32Array(new ArrayBuffer(16), 0, 4);
        const copy1 = clone(original1);
        const copy2 = clone(original2);

        expect(copy1).to.be.a('float32array').and.to.not.equals(original1);
        expect(copy1.buffer.byteLength).to.equals(original1.buffer.byteLength);
        expect(copy1.byteLength).to.equals(original1.byteLength);
        expect(copy1.byteOffset).to.equals(original1.byteOffset);
        expect(copy1.length).to.equals(original1.length);

        expect(copy2).to.be.a('float32array').and.to.not.equals(original2);
        expect(copy2.buffer.byteLength).to.equals(original2.buffer.byteLength);
        expect(copy2.byteLength).to.equals(original2.byteLength);
        expect(copy2.byteOffset).to.equals(original2.byteOffset);
        expect(copy2.length).to.equals(original2.length);
      });
    });

    context('when cloning float64arrays', function() {
      it('should clone the specified float64array', function() {
        const original1 = new Float64Array([5, 9]);
        const original2 = new Float64Array(new ArrayBuffer(32), 0, 4);
        const copy1 = clone(original1);
        const copy2 = clone(original2);

        expect(copy1).to.be.a('float64array').and.to.not.equals(original1);
        expect(copy1.buffer.byteLength).to.equals(original1.buffer.byteLength);
        expect(copy1.byteLength).to.equals(original1.byteLength);
        expect(copy1.byteOffset).to.equals(original1.byteOffset);
        expect(copy1.length).to.equals(original1.length);

        expect(copy2).to.be.a('float64array').and.to.not.equals(original2);
        expect(copy2.buffer.byteLength).to.equals(original2.buffer.byteLength);
        expect(copy2.byteLength).to.equals(original2.byteLength);
        expect(copy2.byteOffset).to.equals(original2.byteOffset);
        expect(copy2.length).to.equals(original2.length);
      });
    });

    context('when cloning int16arrays', function() {
      it('should clone the specified int16array', function() {
        const original1 = new Int16Array([5, 9]);
        const original2 = new Int16Array(new ArrayBuffer(8), 0, 4);
        const copy1 = clone(original1);
        const copy2 = clone(original2);

        expect(copy1).to.be.an('int16array').and.to.not.equals(original1);
        expect(copy1.buffer.byteLength).to.equals(original1.buffer.byteLength);
        expect(copy1.byteLength).to.equals(original1.byteLength);
        expect(copy1.byteOffset).to.equals(original1.byteOffset);
        expect(copy1.length).to.equals(original1.length);

        expect(copy2).to.be.an('int16array').and.to.not.equals(original2);
        expect(copy2.buffer.byteLength).to.equals(original2.buffer.byteLength);
        expect(copy2.byteLength).to.equals(original2.byteLength);
        expect(copy2.byteOffset).to.equals(original2.byteOffset);
        expect(copy2.length).to.equals(original2.length);
      });
    });

    context('when cloning int32arrays', function() {
      it('should clone the specified int32array', function() {
        const original1 = new Int32Array([5, 9]);
        const original2 = new Int32Array(new ArrayBuffer(16), 0, 4);
        const copy1 = clone(original1);
        const copy2 = clone(original2);

        expect(copy1).to.be.an('int32array').and.to.not.equals(original1);
        expect(copy1.buffer.byteLength).to.equals(original1.buffer.byteLength);
        expect(copy1.byteLength).to.equals(original1.byteLength);
        expect(copy1.byteOffset).to.equals(original1.byteOffset);
        expect(copy1.length).to.equals(original1.length);

        expect(copy2).to.be.an('int32array').and.to.not.equals(original2);
        expect(copy2.buffer.byteLength).to.equals(original2.buffer.byteLength);
        expect(copy2.byteLength).to.equals(original2.byteLength);
        expect(copy2.byteOffset).to.equals(original2.byteOffset);
        expect(copy2.length).to.equals(original2.length);
      });
    });

    context('when cloning int8arrays', function() {
      it('should clone the specified int8array', function() {
        const original1 = new Int8Array([5, 9]);
        const original2 = new Int8Array(new ArrayBuffer(4), 0, 4);
        const copy1 = clone(original1);
        const copy2 = clone(original2);

        expect(copy1).to.be.an('int8array').and.to.not.equals(original1);
        expect(copy1.buffer.byteLength).to.equals(original1.buffer.byteLength);
        expect(copy1.byteLength).to.equals(original1.byteLength);
        expect(copy1.byteOffset).to.equals(original1.byteOffset);
        expect(copy1.length).to.equals(original1.length);

        expect(copy2).to.be.an('int8array').and.to.not.equals(original2);
        expect(copy2.buffer.byteLength).to.equals(original2.buffer.byteLength);
        expect(copy2.byteLength).to.equals(original2.byteLength);
        expect(copy2.byteOffset).to.equals(original2.byteOffset);
        expect(copy2.length).to.equals(original2.length);
      });
    });

    context('when cloning maps', function() {
      it('should clone the specified map', function() {
        const original = new Map([['a', 5], ['b', { o: { x: 9 } }]]);
        const copy = clone(original);

        expect(copy).to.be.a('map').and.to.not.equals(original);
        expect(copy.size).to.equals(original.size);
        expect(copy.has('a')).to.be.true;
        expect(copy.has('b')).to.be.true;
        expect(copy.get('a')).to.equals(5);
        expect(copy.get('b')).to.be.an('object').and.to.have.deep.property('o', { x: 9 });

        const isDeleted = original.delete('b');
        expect(isDeleted).to.be.true;
        expect(original.has('b')).to.be.false;
        expect(copy.get('b')).to.be.an('object').and.to.have.deep.property('o', { x: 9 });

        // TODO: TEST MAP WITH OBJECT AS KEY
        const o = { x: 9 };
        const original2 = new Map([[o, 'value']]);
        const copy2 = clone(original2);

        expect(copy2).to.be.a('map').and.to.not.equals(original2);
        expect(original2.has(o)).to.be.true;
        expect(copy2.has(o)).to.be.false;

        const key = copy2.keys().next().value;
        expect(key).to.be.an('object').and.to.have.property('x', 9);
        expect(key).to.not.equals(o);
      });
    });

    context('when cloning objects', function() {
      it('should clone the specified object and keeps inheritance', function() {
        class Pet {}
        class Dog extends Pet {}
        const symbol = Symbol('x');

        const original = {
          x: 5,
          y: Buffer.from('hello', 'base64'),
          z: new Error('not allowed!'),
          p: new Dog(),
          [symbol]: [1, 2, 3],
        };

        const copy = clone(original);

        expect(copy).to.be.an('object').and.to.not.equals(original);
        expect(copy).to.have.property('x', 5);

        expect(copy).to.have.property('y');
        expect(Buffer.isBuffer(copy.y)).to.be.true;
        expect(copy.y.equals(original.y)).to.be.true;
        expect(copy.y).to.not.equals(original.y);

        expect(copy).to.have.property('z');
        expect(copy.z).to.be.an('error').and.to.have.property('message', 'not allowed!');
        expect(copy.z).to.not.equals(original.z);

        expect(copy).to.have.property('p');
        expect(Object.prototype.isPrototypeOf.call(Dog.prototype, copy.p)).to.be.true;
        expect(Object.prototype.isPrototypeOf.call(Pet.prototype, copy.p)).to.be.true;
        expect(copy.p).to.not.equals(original.p);

        expect(copy).to.have.property(symbol.valueOf());
        expect(copy[symbol.valueOf()]).to.not.equals(original[symbol]);
        expect(copy[symbol.valueOf()]).to.be.an('array').and.to.have.length(3);
      });
    });

    context('when cloning rangeerrors', function() {
      it('should clone the specified rangeerror', function() {
        const original = new RangeError('error found');
        const copy = clone(original);

        expect(copy.constructor).to.equals(RangeError);
        expect(copy).to.not.equals(original);
        expect(copy.message).to.equals(original.message);
        expect(copy.name).to.equals(original.name);
        expect(copy.stack).to.equals(original.stack);
      });
    });

    context('when cloning referenceerrors', function() {
      it('should clone the specified referenceerror', function() {
        const original = new ReferenceError('error found');
        const copy = clone(original);

        expect(copy.constructor).to.equals(ReferenceError);
        expect(copy).to.not.equals(original);
        expect(copy.message).to.equals(original.message);
        expect(copy.name).to.equals(original.name);
        expect(copy.stack).to.equals(original.stack);
      });
    });

    context('when cloning regexps', function() {
      it('should clone the specified regexp', function() {
        const original1 = /\w+/g;
        const original2 = new RegExp('\\w+', 'i');
        const copy1 = clone(original1);
        const copy2 = clone(original2);

        expect(copy1).to.be.a('regexp').and.to.not.equals(original1);
        expect(copy1.toString()).to.equals(original1.toString());
        expect(copy1.source).to.equals(original1.source);
        expect(copy1.flags).to.equals(original1.flags);

        expect(copy2).to.be.a('regexp').and.to.not.equals(original2);
        expect(copy2.toString()).to.equals(original2.toString());
        expect(copy2.source).to.equals(original2.source);
        expect(copy2.flags).to.equals(original2.flags);
      });
    });

    context('when cloning sets', function() {
      it('should clone the specified set', function() {
        const o = { x: 9 };
        const original = new Set([o, 5]);
        const copy = clone(original);

        expect(copy).to.be.a('set').and.to.not.equals(original);
        expect(copy.size).to.equals(original.size);
        expect(copy.has(5)).to.be.true;
        expect(copy.has(o)).to.be.false;

        const oCopy = copy.values().next().value;
        expect(oCopy).to.have.property('x', 9);

        const isDeleted = original.delete(o);
        expect(isDeleted).to.be.true;
        expect(original.has(o)).to.be.false;
        expect(copy.has(oCopy)).to.be.true;
      });
    });

    context('when cloning syntaxerrors', function() {
      it('should clone the specified syntaxerror', function() {
        const original = new SyntaxError('error found');
        const copy = clone(original);

        expect(copy.constructor).to.equals(SyntaxError);
        expect(copy).to.not.equals(original);
        expect(copy.message).to.equals(original.message);
        expect(copy.name).to.equals(original.name);
        expect(copy.stack).to.equals(original.stack);
      });
    });

    context('when cloning typeerrors', function() {
      it('should clone the specified typeerror', function() {
        const original = new TypeError('error found');
        const copy = clone(original);

        expect(copy.constructor).to.equals(TypeError);
        expect(copy).to.not.equals(original);
        expect(copy.message).to.equals(original.message);
        expect(copy.name).to.equals(original.name);
        expect(copy.stack).to.equals(original.stack);
      });
    });

    context('when cloning urierrors', function() {
      it('should clone the specified urierror', function() {
        const original = new URIError('error found');
        const copy = clone(original);

        expect(copy.constructor).to.equals(URIError);
        expect(copy).to.not.equals(original);
        expect(copy.message).to.equals(original.message);
        expect(copy.name).to.equals(original.name);
        expect(copy.stack).to.equals(original.stack);
      });
    });

    context('when cloning uint16arrays', function() {
      it('should clone the specified uint16array', function() {
        const original1 = new Uint16Array([5, 9]);
        const original2 = new Uint16Array(new ArrayBuffer(8), 0, 4);
        const copy1 = clone(original1);
        const copy2 = clone(original2);

        expect(copy1).to.be.an('uint16array').and.to.not.equals(original1);
        expect(copy1.buffer.byteLength).to.equals(original1.buffer.byteLength);
        expect(copy1.byteLength).to.equals(original1.byteLength);
        expect(copy1.byteOffset).to.equals(original1.byteOffset);
        expect(copy1.length).to.equals(original1.length);

        expect(copy2).to.be.an('uint16array').and.to.not.equals(original2);
        expect(copy2.buffer.byteLength).to.equals(original2.buffer.byteLength);
        expect(copy2.byteLength).to.equals(original2.byteLength);
        expect(copy2.byteOffset).to.equals(original2.byteOffset);
        expect(copy2.length).to.equals(original2.length);
      });
    });

    context('when cloning uint32arrays', function() {
      it('should clone the specified uint32array', function() {
        const original1 = new Uint32Array([5, 9]);
        const original2 = new Uint32Array(new ArrayBuffer(16), 0, 4);
        const copy1 = clone(original1);
        const copy2 = clone(original2);

        expect(copy1).to.be.an('uint32array').and.to.not.equals(original1);
        expect(copy1.buffer.byteLength).to.equals(original1.buffer.byteLength);
        expect(copy1.byteLength).to.equals(original1.byteLength);
        expect(copy1.byteOffset).to.equals(original1.byteOffset);
        expect(copy1.length).to.equals(original1.length);

        expect(copy2).to.be.an('uint32array').and.to.not.equals(original2);
        expect(copy2.buffer.byteLength).to.equals(original2.buffer.byteLength);
        expect(copy2.byteLength).to.equals(original2.byteLength);
        expect(copy2.byteOffset).to.equals(original2.byteOffset);
        expect(copy2.length).to.equals(original2.length);
      });
    });

    context('when cloning uint8arrays', function() {
      it('should clone the specified uint8array', function() {
        const original1 = new Uint8Array([5, 9]);
        const original2 = new Uint8Array(new ArrayBuffer(4), 0, 4);
        const copy1 = clone(original1);
        const copy2 = clone(original2);

        expect(copy1).to.be.an('uint8array').and.to.not.equals(original1);
        expect(copy1.buffer.byteLength).to.equals(original1.buffer.byteLength);
        expect(copy1.byteLength).to.equals(original1.byteLength);
        expect(copy1.byteOffset).to.equals(original1.byteOffset);
        expect(copy1.length).to.equals(original1.length);

        expect(copy2).to.be.an('uint8array').and.to.not.equals(original2);
        expect(copy2.buffer.byteLength).to.equals(original2.buffer.byteLength);
        expect(copy2.byteLength).to.equals(original2.byteLength);
        expect(copy2.byteOffset).to.equals(original2.byteOffset);
        expect(copy2.length).to.equals(original2.length);
      });
    });

    context('when cloning uint8clampedarrays', function() {
      it('should clone the specified uint8clampedarray', function() {
        const original1 = new Uint8ClampedArray([5, 9]);
        const original2 = new Uint8ClampedArray(new ArrayBuffer(4), 0, 4);
        const copy1 = clone(original1);
        const copy2 = clone(original2);

        expect(copy1).to.be.an('uint8clampedarray').and.to.not.equals(original1);
        expect(copy1.buffer.byteLength).to.equals(original1.buffer.byteLength);
        expect(copy1.byteLength).to.equals(original1.byteLength);
        expect(copy1.byteOffset).to.equals(original1.byteOffset);
        expect(copy1.length).to.equals(original1.length);

        expect(copy2).to.be.an('uint8clampedarray').and.to.not.equals(original2);
        expect(copy2.buffer.byteLength).to.equals(original2.buffer.byteLength);
        expect(copy2.byteLength).to.equals(original2.byteLength);
        expect(copy2.byteOffset).to.equals(original2.byteOffset);
        expect(copy2.length).to.equals(original2.length);
      });
    });

    context('when cloning unsupported objects', function() {
      it('should return undefined for async function', function() {
        expect(clone(async () => {})).to.be.undefined;
      });

      it('should return undefined for function', function() {
        expect(clone(() => {})).to.be.undefined;
      });

      it('should return undefined for generator function', function() {
        expect(clone(function* g() { yield 0; })).to.be.undefined;
      });

      it('should return undefined for intl.collator', function() {
        expect(clone(new Intl.Collator())).to.be.undefined;
      });

      it('should return undefined for intl.datetimeformat', function() {
        expect(clone(new Intl.DateTimeFormat('en-US'))).to.be.undefined;
      });

      it('should return undefined for intl.numberformat', function() {
        expect(clone(new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }))).to.be.undefined;
      });

      // it('should return undefined for intl.pluralrules', function() {
      //   expect(clone(new Intl.PluralRules())).to.be.undefined;
      // });

      it('should return undefined for promise', function() {
        expect(clone(new Promise(() => {}))).to.be.undefined;
      });

      // not working until Node.js v10 to check if an object is a Proxy
      // it('should return undefined for proxy', function() {
      //   expect(clone(new Proxy({}, {}))).to.be.undefined;
      // });

      it('should return undefined for WeakMap', function() {
        expect(clone(new WeakMap())).to.be.undefined;
      });

      it('should return undefined for WeakSet', function() {
        expect(clone(new WeakSet())).to.be.undefined;
      });

      it('should return undefined for constructor functions', function() {
        expect(clone(Array)).to.be.undefined;
        expect(clone(ArrayBuffer)).to.be.undefined;
        expect(clone(Object.getPrototypeOf(async () => {}).constructor)).to.be.undefined;
        expect(clone(Boolean)).to.be.undefined;
        expect(clone(Buffer)).to.be.undefined;
        expect(clone(DataView)).to.be.undefined;
        expect(clone(Date)).to.be.undefined;
        expect(clone(Error)).to.be.undefined;
        expect(clone(EvalError)).to.be.undefined;
        expect(clone(Float32Array)).to.be.undefined;
        expect(clone(Float64Array)).to.be.undefined;
        expect(clone(Function)).to.be.undefined;
        expect(clone(Object.getPrototypeOf(function* g() { yield 0; }).constructor)).to.be.undefined;
        expect(clone(Int16Array)).to.be.undefined;
        expect(clone(Int32Array)).to.be.undefined;
        expect(clone(Int8Array)).to.be.undefined;
        expect(clone(Intl.Collator)).to.be.undefined;
        expect(clone(Intl.DateTimeFormat)).to.be.undefined;
        expect(clone(Intl.NumberFormat)).to.be.undefined;
        expect(clone(Intl.PluralRules)).to.be.undefined;
        expect(clone(Map)).to.be.undefined;
        expect(clone(Number)).to.be.undefined;
        expect(clone(Object)).to.be.undefined;
        expect(clone(Promise)).to.be.undefined;
        expect(clone(Proxy)).to.be.undefined;
        expect(clone(RangeError)).to.be.undefined;
        expect(clone(ReferenceError)).to.be.undefined;
        expect(clone(RegExp)).to.be.undefined;
        expect(clone(Set)).to.be.undefined;
        expect(clone(String)).to.be.undefined;
        expect(clone(Symbol)).to.be.undefined;
        expect(clone(SyntaxError)).to.be.undefined;
        expect(clone(TypeError)).to.be.undefined;
        expect(clone(URIError)).to.be.undefined;
        expect(clone(Uint16Array)).to.be.undefined;
        expect(clone(Uint32Array)).to.be.undefined;
        expect(clone(Uint8Array)).to.be.undefined;
        expect(clone(Uint8ClampedArray)).to.be.undefined;
        expect(clone(WeakMap)).to.be.undefined;
        expect(clone(WeakSet)).to.be.undefined;
      });
    });

    context('when cloning values respresenting nothing', function() {
      it('should return undefined when cloning nothing', function() {
        expect(clone()).to.be.undefined;
      });

      it('should return undefined when cloning undefined', function() {
        expect(clone(undefined)).to.be.undefined;
      });

      it('should return null when cloning null', function() {
        expect(clone(null)).to.be.null;
      });

      it('should return undefined when cloning NaN', function() {
        expect(clone(NaN)).to.be.NaN;
      });
    });

  });
});
