const { cast: { int } } = require('../helpers');
const LibError = require('../LibError');

const encoding = [
  '11011001100',
  '11001101100',
  '11001100110',
  '10010011000',
  '10010001100',
  '10001001100',
  '10011001000',
  '10011000100',
  '10001100100',
  '11001001000',
  '11001000100',
  '11000100100',
  '10110011100',
  '10011011100',
  '10011001110',
  '10111001100',
  '10011101100',
  '10011100110',
  '11001110010',
  '11001011100',
  '11001001110',
  '11011100100',
  '11001110100',
  '11101101110',
  '11101001100',
  '11100101100',
  '11100100110',
  '11101100100',
  '11100110100',
  '11100110010',
  '11011011000',
  '11011000110',
  '11000110110',
  '10100011000',
  '10001011000',
  '10001000110',
  '10110001000',
  '10001101000',
  '10001100010',
  '11010001000',
  '11000101000',
  '11000100010',
  '10110111000',
  '10110001110',
  '10001101110',
  '10111011000',
  '10111000110',
  '10001110110',
  '11101110110',
  '11010001110',
  '11000101110',
  '11011101000',
  '11011100010',
  '11011101110',
  '11101011000',
  '11101000110',
  '11100010110',
  '11101101000',
  '11101100010',
  '11100011010',
  '11101111010',
  '11001000010',
  '11110001010',
  '10100110000',
  '10100001100',
  '10010110000',
  '10010000110',
  '10000101100',
  '10000100110',
  '10110010000',
  '10110000100',
  '10011010000',
  '10011000010',
  '10000110100',
  '10000110010',
  '11000010010',
  '11001010000',
  '11110111010',
  '11000010100',
  '10001111010',
  '10100111100',
  '10010111100',
  '10010011110',
  '10111100100',
  '10011110100',
  '10011110010',
  '11110100100',
  '11110010100',
  '11110010010',
  '11011011110',
  '11011110110',
  '11110110110',
  '10101111000',
  '10100011110',
  '10001011110',
  '10111101000',
  '10111100010',
  '11110101000',
  '11110100010',
  '10111011110',
  '10111101110',
  '11101011110',
  '11110101110',
  '11010000100',
  '11010010000',
  '11010011100',
  '11000111010',
];

const generate = function generate(data) {
  const tableB = ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~';
  const dataLength = data.length;
  let isTableCActivated = true;

  // check each code character to be in tableB
  for (let i = 0; i < dataLength; i += 1) {
    if (tableB.indexOf(data.charAt(i)) === -1) {
      const error = new LibError(LibError.Codes.INVALID_DATA);
      error.setMessage(`each character to encode must be one of '${tableB}', got '${data}'`);

      throw error;
    }

    // check firsts characters : start with C table only if enought numeric
    if (i < 3 && int(data.charAt(i)) === undefined) {
      isTableCActivated = false;
    }
  }

  let sum = isTableCActivated ? 105 : 104;
  let digit = '';
  let i = 0;
  let j = 0;
  let isum = 0;

  // start : [105] : C table or [104] : B table
  digit = encoding[sum];

  while (i < dataLength) {
    if (!isTableCActivated) {
      j = 0;

      // check next character to activate C table if interesting
      while ((i + j) < dataLength && int(data.charAt(i + j)) !== undefined) {
        j += 1;
      }

      // 6 min everywhere or 4 mini at the end
      isTableCActivated = j > 5 || ((i + j - 1) === dataLength && j > 3);

      if (isTableCActivated) {
        digit += encoding[99]; // C table
        isum += 1;
        sum += isum * 99;
      }
      // 2 min for table C so need table B (len - 1 has been taken from Java Barcode 128)
    } else if (i === dataLength - 1
      || int(data.charAt(i)) === undefined
      || int(data.charAt(i + 1)) === undefined) {
      isTableCActivated = false;
      digit += encoding[100]; // B table
      isum += 1;
      sum += isum * 100;
    }

    let encodingIndex;

    if (isTableCActivated) {
      encodingIndex = int(`${data.charAt(i)}${data.charAt(i + 1)}`, { defaultValue: 0 }); // Add two characters (numeric)
      i += 2;
    } else {
      encodingIndex = tableB.indexOf(data.charAt(i)); // Add one character
      i += 1;
    }

    digit += encoding[encodingIndex];
    isum += 1;
    sum += isum * encodingIndex;
  }

  // Add CRC
  digit += encoding[sum % 103];

  // Stop
  digit += encoding[106];

  // Termination bar
  digit += '11';

  return {
    digit,
    hri: data,
  };
};

const Code128 = {
  generate,
};

module.exports = Object.freeze(Code128);
