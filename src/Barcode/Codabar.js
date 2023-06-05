const LibError = require('../LibError');

const encoding = [
  '101010011',
  '101011001',
  '101001011',
  '110010101',
  '101101001',
  '110101001',
  '100101011',
  '100101101',
  '100110101',
  '110100101',
  '101001101',
  '101100101',
  '1101011011',
  '1101101011',
  '1101101101',
  '1011011011',
  '1011001001',
  '1010010011',
  '1001001011',
  '1010011001',
];

const generate = function generate(data) {
  const table = '0123456789-$:/.+';

  if (!/^[0-9-$:/.+]+$/.test(data)) {
    const error = new LibError(LibError.Codes.INVALID_DATA);
    error.setMessage(`each character to encode must be one of '${table}', got '${data}'`);

    throw error;
  }

  const dataLength = data.length;
  const interChar = '0';
  let digit = '';

  // add start : A->D : arbitrary choose A
  digit += `${encoding[16]}${interChar}`;

  for (let i = 0; i < dataLength; i += 1) {
    digit += `${encoding[table.indexOf(data.charAt(i))]}${interChar}`;
  }

  // add stop : A->D : arbitrary choose A
  digit += encoding[16];

  return {
    digit,
    hri: data,
  };
};

const Codabar = {
  generate,
};

module.exports = Object.freeze(Codabar);
