// internal errors
const Codes = {
  MISSING_DATA: {
    code: 'MISSING_DATA',
    message: 'missing data to encode',
    name: 'DataError',
  },
  EMPTY_DATA: {
    code: 'EMPTY_DATA',
    message: 'data to encode is empty',
    name: 'DataError',
  },
  INVALID_DATA: {
    code: 'INVALID_DATA',
    message: 'data to encode must be a string',
    name: 'DataError',
  },
  MISSING_BARCODE_TYPE: {
    code: 'MISSING_BARCODE_TYPE',
    message: 'encoding barcode type is missing',
    name: 'BarcodeTypeError',
  },
  INVALID_BARCODE_TYPE: {
    code: 'INVALID_BARCODE_TYPE',
    message: 'encoding barcode type is not valid',
    name: 'BarcodeTypeError',
  },
  INVALID_OUTPUT: {
    code: 'INVALID_OUTPUT',
    message: 'invalid output',
    name: 'OutputError',
  },
  NO_DIGIT: {
    code: 'NO_DIGIT',
    message: 'no digit generated from data encoded',
    name: 'BarcodeError',
  },
  READABLE_INTERNAL: {
    code: 'READABLE_INTERNAL',
    message: 'internal failure or invalid chunk of data pushed on readable stream',
    name: 'ReadableStreamError',
  },
  WRITABLE_INTERNAL: {
    code: 'WRITABLE_INTERNAL',
    message: 'internal failure writing or piping data on writable stream',
    name: 'WritableStreamError',
  },
};

module.exports = Codes;
