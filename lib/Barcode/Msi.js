const { cast: { int }, object: { is } } = require('../helpers');
const LibError = require('../LibError');

const encoding = [
  '100100100100',
  '100100100110',
  '100100110100',
  '100100110110',
  '100110100100',
  '100110100110',
  '100110110100',
  '100110110110',
  '110100100100',
  '110100100110',
];

const formatMod10 = function formatMod10(data) {
  const dataLength = data.length;
  let toPart1 = dataLength % 2 !== 0;

  let n1 = 0;
  let sum = 0;

  for (let i = 0; i < dataLength; i += 1) {
    if (toPart1) {
      n1 = 10 * n1 + int(data.charAt(i), { defaultValue: 0 });
    } else {
      sum += int(data.charAt(i), { defaultValue: 0 });
    }

    toPart1 = !toPart1;
  }

  const s1 = String(2 * n1);
  const s1Length = s1.length;

  for (let i = 0; i < s1Length; i += 1) {
    sum += int(s1.charAt(i), { defaultValue: 0 });
  }

  return `${data}${(10 - (sum % 10)) % 10}`;
};

const formatMod11 = function formatMod11(data) {
  let sum = 0;
  let weight = 2;

  for (let i = data.length - 1; i >= 0; i -= 1) {
    sum += weight * int(data.charAt(i), { defaultValue: 0 });
    weight = weight === 7 ? 2 : weight + 1;
  }

  return `${data}${(11 - (sum % 11)) % 11}`;
};

// internal method to be used only when data respects expected format
const format = function format(data, crc) {
  let hri = data.valueOf();

  if (is(Object, crc)) {
    if (crc.crc1 === 'mod10') {
      hri = formatMod10(data);
    } else if (crc.crc1 === 'mod11') {
      hri = formatMod11(data);
    }

    if (crc.crc2 === 'mod10') {
      hri = formatMod10(data);
    } else if (crc.crc2 === 'mod11') {
      hri = formatMod11(data);
    }
  } else if (is(Boolean, crc) && crc) {
    hri = formatMod10(data);
  }

  return hri;
};

const generate = function generate(data, crc) {
  if (/^[^0-9]+$/.test(data)) {
    const error = new LibError(LibError.Codes.INVALID_DATA);
    error.setMessage(`data to encode must contain only numerical digits, got '${data}'`);

    throw error;
  }

  const table = '0123456789';
  const dataLength = data.length;
  const hri = format(data, crc);
  let digit = '';

  // start
  digit = '110';

  // digits
  for (let i = 0; i < dataLength; i += 1) {
    digit += encoding[table.indexOf(data.charAt(i))];
  }

  // stop
  digit += '1001';

  return {
    digit,
    hri,
  };
};

const Msi = {
  generate,
};

module.exports = Object.freeze(Msi);
