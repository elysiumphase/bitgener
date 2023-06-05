const {
  dataCWCount,
  logTab,
  aLogTab,
} = require('./constants');

/* eslint no-bitwise: "off" */

// multiplication in galois field gf(2^8)
const champGaloisMult = function champGaloisMult(a, b) {
  if (a === 0 || b === 0) {
    return 0;
  }

  return aLogTab[(logTab[a] + logTab[b]) % 255];
};

// the operation a * 2^b in galois field gf(2^8)
const champGaloisDoub = function champGaloisDoub(a, b) {
  if (a === 0) {
    return 0;
  }

  if (b === 0) {
    return a;
  }

  return aLogTab[(logTab[a] + b) % 255];
};

// sum in galois field gf(2^8)
const champGaloisSum = function champGaloisSum(a, b) {
  return a ^ b;
};

// choose the good index for tables
const selectIndex = function selectIndex(nbDataCodeWords, rectangular) {
  if ((nbDataCodeWords < 1 || nbDataCodeWords > 1558) && !rectangular) {
    return -1;
  }

  if ((nbDataCodeWords < 1 || nbDataCodeWords > 49) && rectangular) {
    return -1;
  }

  let n = 0;

  if (rectangular) {
    n = 24;
  }

  while (dataCWCount[n] < nbDataCodeWords) {
    n += 1;
  }

  return n;
};

const encodeDataCodeWordsASCII = function encodeDataCodeWordsASCII(text) {
  const dataCodeWords = [];
  const textLength = text.length;

  for (let i = 0, n = 0; i < textLength; i += 1) {
    let c = text.charCodeAt(i);

    if (c > 127) {
      dataCodeWords[n] = 235;
      c -= 127;
      n += 1;
    } else if ((c >= 48 && c <= 57)
      && i + 1 < textLength
      && (text.charCodeAt(i + 1) >= 48 && text.charCodeAt(i + 1) <= 57)) {
      c = ((c - 48) * 10) + ((text.charCodeAt(i + 1)) - 48);
      c += 130;
      i += 1;
    } else {
      c += 1;
    }

    dataCodeWords[n] = c;
    n += 1;
  }

  return dataCodeWords;
};

// transform integer to tab of bits
const getBits = function getBits(int) {
  const bits = [];

  for (let i = 0; i < 8; i += 1) {
    bits[i] = int & (128 >> i) ? 1 : 0;
  }

  return bits;
};

const utils = {
  champGaloisMult,
  champGaloisDoub,
  champGaloisSum,
  selectIndex,
  encodeDataCodeWordsASCII,
  getBits,
};

module.exports = Object.freeze(utils);
