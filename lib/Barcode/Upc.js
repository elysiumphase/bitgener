const Ean = require('./Ean');
const LibError = require('../LibError');

const generate = function generate(data) {
  const len = 11;

  if (data.length !== len) {
    const error = new LibError(LibError.Codes.INVALID_DATA);
    error.setMessage(`data to encode must have a length of ${len} digits, got a length of ${data.length}`);

    throw error;
  }

  const { digit, hri } = Ean.generate(`0${data}`, 'ean13');

  return {
    digit,
    hri: hri.substr(1),
  };
};

const Upc = {
  generate,
};

module.exports = Object.freeze(Upc);
