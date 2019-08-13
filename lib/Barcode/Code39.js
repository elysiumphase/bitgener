const LibError = require('../LibError');

const encoding = [
  '101001101101',
  '110100101011',
  '101100101011',
  '110110010101',
  '101001101011',
  '110100110101',
  '101100110101',
  '101001011011',
  '110100101101',
  '101100101101',
  '110101001011',
  '101101001011',
  '110110100101',
  '101011001011',
  '110101100101',
  '101101100101',
  '101010011011',
  '110101001101',
  '101101001101',
  '101011001101',
  '110101010011',
  '101101010011',
  '110110101001',
  '101011010011',
  '110101101001',
  '101101101001',
  '101010110011',
  '110101011001',
  '101101011001',
  '101011011001',
  '110010101011',
  '100110101011',
  '110011010101',
  '100101101011',
  '110010110101',
  '100110110101',
  '100101011011',
  '110010101101',
  '100110101101',
  '100100100101',
  '100100101001',
  '100101001001',
  '101001001001',
  '100101101101',
];

const generate = function generate(data) {
  const table = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-. $/+%*';

  if (!/^[0-9a-zA-Z-. $/+%]+$/.test(data)) {
    const error = new LibError(LibError.Codes.INVALID_DATA);
    error.setMessage(`each character to encode must be one of '${table.replace('*', '')}', got '${data}'`);

    throw error;
  }

  // add Start and Stop charactere : *
  const hri = data.toUpperCase();
  const dataToEncode = `*${hri}*`;
  const dataToEncodeLength = dataToEncode.length;
  const interChar = '0';
  let digit = '';

  for (let i = 0; i < dataToEncodeLength; i += 1) {
    if (i > 0) {
      digit += interChar;
    }

    digit += encoding[table.indexOf(dataToEncode.charAt(i))];
  }

  return {
    digit,
    hri,
  };
};

const Code39 = {
  generate,
};

module.exports = Object.freeze(Code39);
