/**
 * Output helper.
 *
 *    - async check(output) -> Boolean throw LibError
 *    - async generate({ svg, settings }) -> String|Stream|Buffer throw LibError
 */
const { dirname } = require('path');
const { promisify } = require('util');
const { stat: statCallback } = require('fs');
const LibError = require('../LibError');
const { outputs: { types, svgFile } } = require('../settings');
const {
  createReadable,
  pipeToWritableFile,
} = require('./stream');

const stat = promisify(statCallback);

// check
const check = async function check(output) {
  if (svgFile.test(output)) {
    const dirPath = dirname(output);
    let stats;

    try {
      stats = await stat(dirPath);
    } catch (e) {
      const error = new LibError(LibError.Codes.INVALID_OUTPUT, e);

      if (e.code === 'ENOENT') {
        error.setMessage(`no such directory at ${dirPath}`);
      } else {
        error.setMessage(e.message);
      }

      throw error;
    }

    if (!stats.isDirectory()) {
      const error = new LibError(LibError.Codes.INVALID_OUTPUT);
      error.setMessage(`no such directory at ${dirPath}`);

      throw error;
    }
  } else if (types.indexOf(output) === -1) {
    const error = new LibError(LibError.Codes.INVALID_OUTPUT);
    error.setMessage(`${output} is not a valid output, must be ${types.join(', ')} or a valid file path with svg extension`);

    throw error;
  }

  return true;
};

// generate
const generate = async function generate({ svg, settings } = {}) {
  let svgOutput;

  if (settings.output === 'string') {
    svgOutput = svg;
  } else if (settings.output === 'buffer') {
    svgOutput = Buffer.from(svg, settings.encoding);
  } else {
    let rstream;

    try {
      rstream = createReadable(svg, { encoding: settings.encoding });
    } catch (e) {
      const error = new LibError(LibError.Codes.READABLE_INTERNAL, e);
      error.setMessage(e.message);
      throw error;
    }

    if (settings.output === 'stream') {
      svgOutput = rstream;
    } else {
      try {
        await pipeToWritableFile({
          rstream,
          path: settings.output,
          options: { encoding: settings.encoding },
        });

        svgOutput = svg;
      } catch (e) {
        const error = new LibError(LibError.Codes.WRITABLE_INTERNAL, e);
        error.setMessage(e.message);

        throw error;
      }
    }
  }

  return svgOutput;
};

module.exports = Object.freeze({
  check,
  generate,
});
