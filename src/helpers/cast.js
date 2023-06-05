/**
 * Type casting helper from consis (https://github.com/elysiumphase/consis).
 *
 *    - str(thing) -> String or undefined
 *    - num(thing, { le, ge } = {}) -> Number or undefined
 *    - int(thing, { le, ge } = {}) -> Integer Number or undefined
 */
const { is, exists } = require('./object');

/**
 * @func str
 *
 * cast to primitive string if possible or returns undefined
 * because String(undefined|null|NaN) returns a string 'undefined'|'null'|'NaN'
 * NOTE: String() calls method toString
 *
 * @param  {Any} thing a value to cast to primitive string
 * @return {String|undefined}
 */
const str = function str(thing) {
  if (is(String, thing)) {
    return String(thing);
  }

  if (exists(thing)) {
    const castStr = String(thing);

    return /^\[object\s\w{1,}\]$/.test(castStr) ? undefined : castStr;
  }

  return undefined;
};

// cast to primitive number if possible or returns undefined
// because Number(null) returns 0 and Number(undefined|NaN) returns NaN!
// only finite values
// beware to call Number.isFinite only on number values!
const number = function number(thing) {
  let castNum;

  if (exists(thing)) {
    const value = thing.valueOf();

    if (is(Number, value)) {
      if (Number.isFinite(value)) {
        castNum = value;
      }
    } else if (is(String, value) || is(Boolean, value)) {
      const cast = Number(value);

      if (Number.isFinite(cast)) {
        castNum = cast;
      }
    }
  }

  return castNum;
};

// cast to primitive number, with 'less or equal than'
// or 'greater or equal than' options, or returns undefined
const num = function num(thing, { ge, le } = {}) {
  let castNum = number(thing);

  if (castNum !== undefined) {
    const lessThan = number(le);
    const greaterThan = number(ge);

    if (lessThan !== undefined && greaterThan !== undefined) {
      if (castNum < greaterThan || castNum > lessThan) {
        castNum = undefined;
      }
    } else if (lessThan !== undefined && castNum > lessThan) {
      castNum = undefined;
    } else if (greaterThan !== undefined && castNum < greaterThan) {
      castNum = undefined;
    }
  }

  return castNum;
};

// cast to primitive integer if possible or returns undefined
const integer = function integer(thing) {
  // first cast to number to avoid some inconsistencies with hexa
  const castNum = number(thing);
  let castInt;

  if (castNum !== undefined) {
    const int = parseInt(castNum, 10);

    if (!Number.isNaN(int)) {
      castInt = int;
    }
  }

  return castInt;
};

// cast to primitive integer, with 'less or equal than'
// or 'greater or equal than' options, or returns undefined
const int = function int(thing, { le, ge } = {}) {
  let castInt = integer(thing);

  if (castInt !== undefined) {
    const lessThan = integer(le);
    const greaterThan = integer(ge);

    if (lessThan !== undefined && greaterThan !== undefined) {
      if (castInt < greaterThan || castInt > lessThan) {
        castInt = undefined;
      }
    } else if (lessThan !== undefined && castInt > lessThan) {
      castInt = undefined;
    } else if (greaterThan !== undefined && castInt < greaterThan) {
      castInt = undefined;
    }
  }

  return castInt;
};

// exports
module.exports = Object.freeze({
  str,
  number,
  num,
  int,
  integer,
});
