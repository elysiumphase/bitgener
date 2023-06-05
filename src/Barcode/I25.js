const { cast: { int } } = require('../helpers');
const LibError = require('../LibError');

const encoding = [
  'NNWWN',
  'WNNNW',
  'NWNNW',
  'WWNNN',
  'NNWNW',
  'WNWNN',
  'NWWNN',
  'NNNWW',
  'WNNWN',
  'NWNWN',
];

const generate = function generate(data, crc, type) {
  if (/^[^0-9]+$/.test(data)) {
    const error = new LibError(LibError.Codes.INVALID_DATA);
    error.setMessage(`data to encode must contain only numerical digits, got '${data}'`);

    throw error;
  }

  let dataToEncode;
  const dataLength = data.length;

  if (!crc) {
    if (dataLength % 2 !== 0) {
      dataToEncode = `0${data}`;
    } else {
      dataToEncode = data.valueOf();
    }
  } else {
    if (type === 'int25' && dataLength % 2 === 0) {
      dataToEncode = `0${data}`;
    } else {
      dataToEncode = data.valueOf();
    }

    let odd = true;
    let sum = 0;

    for (let i = dataLength - 1; i > -1; i -= 1) {
      const intChar = int(data.charAt(i), { defaultValue: 0 });
      sum += odd ? 3 * intChar : intChar;
      odd = !odd;
    }

    dataToEncode = `${dataToEncode}${(10 - (sum % 10)) % 10}`;
  }

  const dataToEncodeLength = dataToEncode.length;
  let digit = '';

  // interleaved 2 of 5
  if (type === 'int25') {
    // start
    digit = '1010';

    // digits + CRC
    for (let i = 0; i < dataToEncodeLength / 2; i += 1) {
      // NOTE: c1 and c2 are characters but can be used as array indexes
      //      as integer indexes are actually coerced into a string
      const c1 = dataToEncode.charAt(2 * i);
      const c2 = dataToEncode.charAt(2 * i + 1);

      for (let j = 0; j < 5; j += 1) {
        digit += '1';

        if (encoding[c1].charAt(j) === 'W') {
          digit += '1';
        }

        digit += '0';

        if (encoding[c2].charAt(j) === 'W') {
          digit += '0';
        }
      }
    }

    // stop
    digit += '1101';

    /**
     * Standard 2 of 5 is a numeric-only barcode that has been in use a long time.
     * Unlike Interleaved 2 of 5, all of the information is encoded in the bars;
     * the spaces are fixed width and are used only to separate the bars.
     * The code is self-checking and does not include a checksum.
     */
  } else if (type === 'std25') {
    // start
    digit = '11011010';

    // digits + CRC
    for (let i = 0; i < dataToEncodeLength; i += 1) {
      const c = dataToEncode.charAt(i);

      for (let j = 0; j < 5; j += 1) {
        digit += '1';

        if (encoding[c].charAt(j) === 'W') {
          digit += '11';
        }

        digit += '0';
      }
    }

    // stop
    digit += '11010110';
  }

  return {
    digit,
    hri: dataToEncode,
  };
};

const I25 = {
  generate,
};

module.exports = Object.freeze(I25);
