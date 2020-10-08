const { cast: { int } } = require('../helpers');
const LibError = require('../LibError');

const encoding = [
  ['0001101', '0100111', '1110010'],
  ['0011001', '0110011', '1100110'],
  ['0010011', '0011011', '1101100'],
  ['0111101', '0100001', '1000010'],
  ['0100011', '0011101', '1011100'],
  ['0110001', '0111001', '1001110'],
  ['0101111', '0000101', '1010000'],
  ['0111011', '0010001', '1000100'],
  ['0110111', '0001001', '1001000'],
  ['0001011', '0010111', '1110100'],
];

const first = [
  '000000',
  '001011',
  '001101',
  '001110',
  '010011',
  '011001',
  '011100',
  '010101',
  '010110',
  '011010',
];

const generate = function generate(data, type) {
  // check len (12 for ean13, 7 for ean8)
  const len = type === 'ean8' ? 7 : 12;

  if (data.length !== len) {
    const error = new LibError(LibError.Codes.INVALID_DATA);
    error.setMessage(`data to encode must have a length of ${len} digits, got a length of ${data.length}`);

    throw error;
  }

  const dataLength = data.length;

  // check each digit is numeric and construct the data to compute
  let checksum = 0;
  let odd = true;

  // starting from the end of data as position 1 whatever the code length is
  // ean odd data digits are always weight of 3
  // ean even data digits are always weight of 1
  for (let i = dataLength - 1; i >= 0; i -= 1) {
    const intChar = int(data.charAt(i));

    if (intChar === undefined) {
      const error = new LibError(LibError.Codes.INVALID_DATA);
      error.setMessage(`data to encode must contain only numerical digits, got '${data}'`);

      throw error;
    }

    checksum += (odd ? 3 : 1) * intChar;
    odd = !odd;
  }

  const dataToEncode = `${data}${(10 - (checksum % 10)) % 10}`;

  // start
  let digit = '101';

  if (type === 'ean8') {
    // process left part
    for (let i = 0; i < 4; i += 1) {
      digit += encoding[int(dataToEncode.charAt(i), { defaultValue: 0 })][0];
    }

    // center guard bars
    digit += '01010';

    // process right part
    for (let i = 4; i < 8; i += 1) {
      digit += encoding[int(dataToEncode.charAt(i), { defaultValue: 0 })][2];
    }
  } else { // ean13
    // extract first digit and get sequence
    const seq = first[int(dataToEncode.charAt(0), { defaultValue: 0 })];

    // process left part
    for (let i = 1; i < 7; i += 1) {
      /* eslint max-len: "off" */
      digit += encoding[int(dataToEncode.charAt(i), { defaultValue: 0 })][int(seq.charAt(i - 1), { defaultValue: 0 })];
    }

    // center guard bars
    digit += '01010';

    // process right part
    for (let i = 7; i < 13; i += 1) {
      digit += encoding[int(dataToEncode.charAt(i), { defaultValue: 0 })][2];
    }
  }

  // stop
  digit += '101';

  return {
    digit,
    hri: dataToEncode,
  };
};

const Ean = {
  generate,
};

module.exports = Object.freeze(Ean);
