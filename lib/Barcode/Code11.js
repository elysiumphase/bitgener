const LibError = require('../LibError');

const encoding = [
  '101011',
  '1101011',
  '1001011',
  '1100101',
  '1011011',
  '1101101',
  '1001101',
  '1010011',
  '1101001',
  '110101',
  '101101',
];

const generate = function generate(data) {
  const table = '0123456789-';

  if (!/^[0-9-]+$/.test(data)) {
    const error = new LibError(LibError.Codes.INVALID_DATA);
    error.setMessage(`each character to encode must be one of '${table}', got '${data}'`);

    throw error;
  }

  const dataLength = data.length;
  const interChar = '0';
  let digit = '';

  // start
  digit = `1011001${interChar}`;

  // digits
  for (let i = 0; i < dataLength; i += 1) {
    digit += `${encoding[table.indexOf(data.charAt(i))]}${interChar}`;
  }

  // checksum
  let weightC = 0;
  let weightSumC = 0;
  let weightK = 1; // start at 1 because the right-most character is 'C' checksum
  let weightSumK = 0;

  for (let i = dataLength - 1; i >= 0; i -= 1) {
    weightC = weightC === 10 ? 1 : weightC + 1;
    weightK = weightK === 10 ? 1 : weightK + 1;

    const index = table.indexOf(data.charAt(i));

    weightSumC += weightC * index;
    weightSumK += weightK * index;
  }

  const c = weightSumC % 11;
  weightSumK += c;
  const k = weightSumK % 11;

  digit += `${encoding[c]}${interChar}`;

  if (dataLength >= 10) {
    digit += `${encoding[k]}${interChar}`;
  }

  // stop
  digit += '1011001';

  return {
    digit,
    hri: data,
  };
};

const Code11 = {
  generate,
};

module.exports = Object.freeze(Code11);
