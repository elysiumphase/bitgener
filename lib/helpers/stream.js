/**
 * Stream helper.
 *
 *    - createReadable(chunk, {
 *        highWaterMark,
 *        encoding,
 *        objectMode,
 *        read,
 *        destroy,
 *      } = {}) -> Readable throw Error
 *    - pipeToWritableFile({
 *        path,
 *        rstream,
 *        options: {
 *          flags,
 *          encoding,
 *          fd,
 *          mode,
 *          autoClose,
 *          } = {},
 *          }) -> Promise
 */
const stream = require('stream');
const { promisify } = require('util');
const { createWriteStream } = require('fs');
const { is } = require('./object');
const LibError = require('../LibError');
const debug = require('../debug')('bitgener:stream-helper', 'cyan');

const pipeline = promisify(stream.pipeline);

const readableDefaultOptions = {
  highWaterMark: 16384,
  encoding: null,
  objectMode: false,
  read() {},
  destroy() {},
};

const writableFileDefaultOptions = {
  flags: 'w',
  encoding: 'utf8',
  fd: null,
  mode: 0o666,
  autoClose: true,
};

// createReadable
const createReadable = function createReadable(chunk, {
  highWaterMark,
  encoding,
  objectMode,
  read,
  destroy,
} = {}) {
  const options = {
    highWaterMark: highWaterMark || readableDefaultOptions.highWaterMark,
    encoding: encoding || readableDefaultOptions.encoding,
    objectMode: objectMode || readableDefaultOptions.objectMode,
    read: is(Function, read) ? read : readableDefaultOptions.read,
    destroy: is(Function, destroy) ? destroy : readableDefaultOptions.destroy,
  };

  const rstream = new stream.Readable(options);

  // can throw TypeError
  rstream.push(chunk);
  rstream.push(null);

  debug('readable stream created');

  return rstream;
};

// pipeToWritableFile
const pipeToWritableFile = async function pipeToWritableFile({
  path,
  rstream,
  options: {
    flags,
    encoding,
    fd,
    mode,
    autoClose,
  } = {},
}) {
  const options = {
    flags: flags || writableFileDefaultOptions.flags,
    encoding: encoding || writableFileDefaultOptions.encoding,
    fd: fd || writableFileDefaultOptions.fd,
    mode: mode || writableFileDefaultOptions.mode,
    autoClose: autoClose || writableFileDefaultOptions.autoClose,
  };

  const wstream = createWriteStream(path, options);

  // listen to error events
  wstream.once('error', (e) => {
    const error = new LibError(LibError.Codes.WRITABLE_INTERNAL);
    error.setMessage(e.message);
    debug(error);
  });

  rstream.once('error', (e) => {
    const error = new LibError(LibError.Codes.READABLE_INTERNAL);
    error.setMessage(e.message);
    debug(error);
  });

  await pipeline(rstream, wstream);
  debug(`file ${path} created`);
};

module.exports = Object.freeze({
  createReadable,
  pipeToWritableFile,
});
