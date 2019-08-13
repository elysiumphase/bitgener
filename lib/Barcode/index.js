const types = require('./types');
const I25 = require('./I25');
const Ean = require('./Ean');
const Upc = require('./Upc');
const Msi = require('./Msi');
const Code11 = require('./Code11');
const Code39 = require('./Code39');
const Code93 = require('./Code93');
const Code128 = require('./Code128');
const Codabar = require('./Codabar');
const Datamatrix = require('./Datamatrix');
const LibError = require('../LibError');

// generate digit and hri according to barcode type
const generate = function generate({
  data,
  type,
  settings: {
    crc,
    rectangular,
    addQuietZone,
  } = {},
} = {}) {
  let digit = '';
  let hri = ''; // Human Readable Interpretation
  let is2D = false;

  switch (type) {
    case 'std25':
    case 'int25':
      ({ digit, hri } = I25.generate(data, crc, type));
      break;
    case 'ean8':
    case 'ean13':
      ({ digit, hri } = Ean.generate(data, type));
      break;
    case 'upc':
      ({ digit, hri } = Upc.generate(data));
      break;
    case 'code11':
      ({ digit, hri } = Code11.generate(data));
      break;
    case 'code39':
      ({ digit, hri } = Code39.generate(data));
      break;
    case 'code93':
      ({ digit, hri } = Code93.generate(data, crc));
      break;
    case 'code128':
      ({ digit, hri } = Code128.generate(data));
      break;
    case 'codabar':
      ({ digit, hri } = Codabar.generate(data));
      break;
    case 'msi':
      ({ digit, hri } = Msi.generate(data, crc));
      break;
    case 'datamatrix':
      ({ digit, hri } = Datamatrix.generate(data, rectangular));
      is2D = true;
      break;
    default:
  }

  // if no digit generated throw error
  if (digit.length === 0) {
    throw new LibError(LibError.Codes.NO_DIGIT);
  }

  // add Quiet Zone if specified in settings
  if (!is2D && addQuietZone) {
    digit = `0000000000${digit}0000000000`;
  }

  return { digit, hri, is2D };
};

module.exports = Object.freeze({
  types,
  generate,
});
