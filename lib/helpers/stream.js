/**
 * Stream helper.
 *
 *    - createReadable(chunk, {
 *        highWaterMark,
 *        encoding,
 *        objectMode,
 *        read,
 *        destroy,
 *      } = {}) -> Promise (Readable or Error)
 *    - pipeToWritableFile(path, rstream, {
 *        flags,
 *        encoding,
 *        fd,
 *        mode,
 *        autoClose,
 *      } = {}) -> Promise(Writable or Error)
 */
const { Readable } = require('stream');
const { createWriteStream } = require('fs');
const { is } = require('./object');

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

const createReadable = function createReadable(chunk, {
  highWaterMark,
  encoding,
  objectMode,
  read,
  destroy,
} = {}) {
  return new Promise((resolve, reject) => {
    const options = {
      highWaterMark: highWaterMark || readableDefaultOptions.highWaterMark,
      encoding: encoding || readableDefaultOptions.encoding,
      objectMode: objectMode || readableDefaultOptions.objectMode,
      read: is(Function, read) ? read : readableDefaultOptions.read,
      destroy: is(Function, destroy) ? destroy : readableDefaultOptions.destroy,
    };

    const rstream = new Readable(options);

    rstream.on('error', reject);

    rstream.push(chunk);
    rstream.push(null);

    resolve(rstream);
  });
};

const pipeToWritableFile = function pipeToWritableFile(path, rstream, {
  flags,
  encoding,
  fd,
  mode,
  autoClose,
} = {}) {
  return new Promise((resolve, reject) => {
    const options = {
      flags: flags || writableFileDefaultOptions.flags,
      encoding: encoding || writableFileDefaultOptions.encoding,
      fd: fd || writableFileDefaultOptions.fd,
      mode: mode || writableFileDefaultOptions.mode,
      autoClose: autoClose || writableFileDefaultOptions.autoClose,
    };

    const wstream = createWriteStream(path, options);

    rstream.on('error', reject);
    wstream.on('error', reject);
    wstream.on('close', () => resolve(true));

    rstream.pipe(wstream);
  });
};

module.exports = Object.freeze({
  createReadable,
  pipeToWritableFile,
});
