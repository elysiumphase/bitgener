/**
 * Bitgener
 */
const debug = require('./debug')('bitgener', 'red');
const Barcode = require('./Barcode');
const LibError = require('./LibError');
const { defaults, encodings } = require('./settings');
const {
  barcode: {
    digitToSvg,
  },
  cast: {
    num,
  },
  color: {
    isColor,
  },
  font: {
    getSafeFont,
  },
  object: {
    exists,
    is,
    isEmptyOwn,
    clone,
  },
  output: {
    check: checkOutput,
    generate: generateOutput,
  },
} = require('./helpers');

// caching could improve speed
const { floor, min, max } = Math;

/**
 * @func bitgener
 *
 * Encode data into the specificied barcode type.
 * @param  {String} data             data to encode
 * @param  {String} type             the supported symbology in which data will be encoded
 * @param  {String} output           file path with .svg extension, buffer, stream,
 *                                   string representing svg element
 * @param  {String} encoding         encoding for stream, buffer and file outputs
 * @param  {Boolean} crc             cyclic redundancy check
 * @param  {Boolean} rectangular     rectangular option for datamatrix
 * @param  {Number} padding          the space in pixels around one side of the
 *                                   barcode that will be applied for its 4 sides
 * @param  {Number} width            the width in pixels to fix for the generated image
 * @param  {Number} height           the height in pixels to fix for the generated image
 * @param  {Number} barWidth         the bar width in pixels for 1D barcodes
 * @param  {Number} barHeight        he bar height in pixels for 1D barcodes
 * @param  {Boolean} original1DSize  option to keep the original 1D barcode size
 * @param  {Boolean} original2DSize  option to keep the original 2D barcode size based on width
 * @param  {Boolean} addQuietZone    option to add a quiet zone at the end of 1D barcodes
 * @param  {String} color            the bars color
 * @param  {Number} opacity          the bars opacity
 * @param  {String} bgColor          the background color
 * @param  {Number} bgOpacity        the background opacity
 * @param  {Object} hri              human readable interpretation
 * @param  {Boolean} hri.show        whether to show hri
 * @param  {Number} hri.fontFamily   a generic font name based on cssfontstack.com
 * @param  {Number} hri.fontSize     the font size in pixels
 * @param  {Number} hri.marginTop    the margin size in pixels between the barcode bottom and
 *                                   the hri text
 */
const bitgener = async function bitgener({
  data,
  type,
  output,
  encoding,
  crc,
  rectangular,
  padding,
  width: w,
  height: h,
  barWidth,
  barHeight,
  original1DSize,
  original2DSize,
  addQuietZone,
  color,
  opacity,
  bgColor,
  bgOpacity,
  hri,
} = {}) {
  // check data is not missing or empty
  if (!exists(data)) {
    throw new LibError(LibError.Codes.MISSING_DATA);
  } else if (!is(String, data)) {
    throw new LibError(LibError.Codes.INVALID_DATA);
  } else if (isEmptyOwn(data)) {
    throw new LibError(LibError.Codes.EMPTY_DATA);
  }

  // check type is supported
  if (!exists(type)) {
    throw new LibError(LibError.Codes.MISSING_BARCODE_TYPE);
  } else if (Barcode.types.indexOf(type) === -1) {
    const error = new LibError(LibError.Codes.INVALID_BARCODE_TYPE);
    error.setMessage(`barcode type must be one of ${Barcode.types.join(', ')}; got '${type}'`);
    throw error;
  }

  let ret;

  try {
    /**
     * ensure user settings match default settings types and have correct values
     * or keep default values
     */
    const settings = clone(defaults);

    // ouput
    await checkOutput(output);

    settings.output = output;

    // encoding
    if (encodings.indexOf(encoding) !== -1) {
      settings.encoding = encoding;
    }

    // crc
    if (is(Boolean, crc)) {
      settings.crc = crc;
    }

    // rectangular
    if (is(Boolean, rectangular)) {
      settings.rectangular = rectangular;
    }

    // padding
    const paddingValue = num(padding, { ge: 0 });

    if (exists(paddingValue)) {
      settings.padding = paddingValue;
    }

    // width
    const widthValue = num(w, { ge: 10 });

    if (exists(widthValue)) {
      settings.width = widthValue;
    }

    // height
    const heightValue = num(h, { ge: 10 });

    if (exists(heightValue)) {
      settings.height = heightValue;
    }

    // barWidth
    const barWidthValue = num(barWidth, { ge: 1 });

    if (exists(barWidthValue)) {
      settings.barWidth = barWidthValue;
    }

    // barHeight
    const barHeightValue = num(barHeight, { ge: 1 });

    if (exists(barHeightValue)) {
      settings.barHeight = barHeightValue;
    }

    // original1DSize
    if (is(Boolean, original1DSize)) {
      settings.original1DSize = original1DSize;
    }

    // original2DSize
    if (is(Boolean, original2DSize)) {
      settings.original2DSize = original2DSize;
    }

    // addQuietZone
    if (is(Boolean, addQuietZone)) {
      settings.addQuietZone = addQuietZone;
    }

    // color
    if (isColor(color)) {
      settings.color = color;
    }

    // opacity
    const opacityValue = num(opacity, { ge: 0, le: 1 });

    if (exists(opacityValue)) {
      settings.opacity = opacityValue;
    }

    // bgColor
    if (isColor(bgColor)) {
      settings.bgColor = bgColor;
    }

    // bgOpacity
    const bgOpacityValue = num(bgOpacity, { ge: 0, le: 1 });

    if (exists(bgOpacityValue)) {
      settings.bgOpacity = bgOpacityValue;
    }

    // hri
    if (is(Object, hri)) {
      // show
      if (is(Boolean, hri.show)) {
        settings.hri.show = hri.show;
      }

      // fontFamily
      settings.hri.fontFamily = getSafeFont(hri.fontFamily) || defaults.hri.fontFamily;

      // fontSize
      const fontSizeValue = num(hri.fontSize, { ge: 1 });

      if (exists(fontSizeValue)) {
        settings.hri.fontSize = fontSizeValue;
      }

      // marginTop
      const marginTopValue = num(hri.marginTop, { ge: 0 });

      if (exists(marginTopValue)) {
        settings.hri.marginTop = marginTopValue;
      }
    }

    debug(`data: ${data}`, `type: ${type}`);
    debug('settings:', settings);

    // generate digit and hri text
    const { digit, hri: hriText, is2D } = Barcode.generate({ data, type, settings });

    // get svg string and final width and height from digit then calculate density (for sharp only)
    const { svg, width, height } = digitToSvg({
      digit,
      is2D,
      settings,
      hri: hriText,
    });
    const density = floor((72 * max(width, height)) / min(width, height));

    debug('generated:', {
      svg,
      width,
      height,
      density,
      type,
      data,
      hri: hriText,
    });

    ret = {
      width,
      height,
      density,
      type,
      data,
      hri: hriText,
      output: settings.output,
      encoding: settings.encoding,
    };

    ret.svg = await generateOutput({ svg, settings });
  } catch (e) {
    const error = LibError.format(e);
    debug(error.toString());
    throw error;
  }

  return ret;
};

module.exports = bitgener;
