const LibError = require('../LibError');

const encoding = [
  '100010100',
  '101001000',
  '101000100',
  '101000010',
  '100101000',
  '100100100',
  '100100010',
  '101010000',
  '100010010',
  '100001010',
  '110101000',
  '110100100',
  '110100010',
  '110010100',
  '110010010',
  '110001010',
  '101101000',
  '101100100',
  '101100010',
  '100110100',
  '100011010',
  '101011000',
  '101001100',
  '101000110',
  '100101100',
  '100010110',
  '110110100',
  '110110010',
  '110101100',
  '110100110',
  '110010110',
  '110011010',
  '101101100',
  '101100110',
  '100110110',
  '100111010',
  '100101110',
  '111010100',
  '111010010',
  '111001010',
  '101101110',
  '101110110',
  '110101110',
  '100100110',
  '111011010',
  '111010110',
  '100110010',
  '101011110',
];

const generate = function generate(data, crc) {
  const table = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-. $/+%____*'; // _ => ($), (%), (/) et (+)

  if (!/^[0-9a-zA-Z-. $/+%]+$/.test(data)) {
    const error = new LibError(LibError.Codes.INVALID_DATA);
    error.setMessage(`each character to encode must be one of '${table.replace(/\*|_/g, '')}', got '${data}'`);

    throw error;
  }

  const dataToEncode = data.toUpperCase();
  const dataToEncodeLength = dataToEncode.length;
  let digit = '';

  // start :  *
  digit += encoding[47];

  // digits
  for (let i = 0; i < dataToEncodeLength; i += 1) {
    digit += encoding[table.indexOf(dataToEncode.charAt(i))];
  }

  // checksum
  if (crc) {
    let weightC = 0;
    let weightSumC = 0;
    let weightK = 1; // start at 1 because the right-most character is 'C' checksum
    let weightSumK = 0;

    for (let i = dataToEncodeLength - 1; i >= 0; i -= 1) {
      weightC = weightC === 20 ? 1 : weightC + 1;
      weightK = weightK === 15 ? 1 : weightK + 1;

      const index = table.indexOf(dataToEncode.charAt(i));

      weightSumC += weightC * index;
      weightSumK += weightK * index;
    }

    const c = weightSumC % 47;
    weightSumK += c;
    const k = weightSumK % 47;

    digit += encoding[c];
    digit += encoding[k];
  }

  // stop : *
  digit += encoding[47];

  // terminaison bar
  digit += '1';

  return {
    digit,
    hri: dataToEncode,
  };
};

const Code93 = {
  generate,
};

module.exports = Object.freeze(Code93);
