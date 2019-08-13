/**
 * Barcode helper.
 *
 *    - bitStringTo2DArray(digit) -> 2D Array
 *    - checkPaddingAndHriHeight({
 *        fontSize: font,
 *        marginTop: margin,
 *        paddingWidth: padWidth,
 *        paddingHeight: padHeight,
 *        width,
 *        height,
 *      } = {}) -> Object { marginTop, fontSize, hriHeight, paddingWidth, paddingHeight }
 *    - digitToSvg({ digit, hri, is2D, settings } = {}) -> Object { svg, width, height }
 */
const debug = require('../debug')('bitgener-barcode-helper');
const { int } = require('./cast');
const { defaults } = require('../settings');
const { fontsSizeRatio } = require('./font');

// caching could improve speed
const { floor, min, round } = Math;

// convert a bit string to an array of array of bit char
const bitStringTo2DArray = function bitStringTo2DArray(digit) {
  const len = digit.length;
  const array2D = [];
  array2D[0] = [];

  for (let i = 0; i < len; i += 1) {
    array2D[0].push(digit.charAt(i));
  }

  return array2D;
};

// check hri height and padding to not exceed total height or width
const checkPaddingAndHriHeight = function checkPaddingAndHriHeight({
  fontSize: font,
  marginTop: margin,
  paddingWidth: padWidth,
  paddingHeight: padHeight,
  width,
  height,
} = {}) {
  let marginTop = margin;
  let fontSize = font;
  let paddingWidth = padWidth;
  let paddingHeight = padHeight;

  if (font + margin + padHeight >= height / 2) {
    ({ hri: { marginTop, fontSize } } = defaults);
    paddingWidth = defaults.padding * 2;
    paddingHeight = paddingWidth;
  } else if (padWidth >= width / 2) {
    paddingWidth = defaults.padding * 2;
    paddingHeight = paddingWidth;
  }

  const hriHeight = marginTop + fontSize;

  return {
    marginTop,
    fontSize,
    hriHeight,
    paddingWidth,
    paddingHeight,
  };
};

const digitToSvg = function digitToSvg({
  digit,
  hri,
  is2D,
  settings,
} = {}) {
  const digitToConvert = is2D ? digit.slice(0) : bitStringTo2DArray(digit);
  const lines = digitToConvert.length;
  const columns = digitToConvert[0].length;
  const fontSizeRatio = fontsSizeRatio[settings.hri.fontFamily];
  let width;
  let height;
  let codeWidth;
  let codeHeight;
  let moduleWidth;
  let moduleHeight;
  let hriHeight;
  let { marginTop, fontSize } = settings.hri;
  let residualSize = 0;

  // calclulate hri height (can change if hri height is bigger than svh height)
  hriHeight = marginTop + fontSize;

  // init paddings
  let paddingWidth = settings.padding * 2;
  let paddingHeight = paddingWidth;


  // datamatrix
  if (is2D) {
    // rectangular
    if (settings.rectangular) {
      // original size is based on settings width
      if (settings.original2DSize) {
        ({ width } = settings);

        if (settings.hri.show) {
          codeWidth = width - paddingWidth - (hriHeight * 2);
        } else {
          codeWidth = width - paddingWidth;
        }

        let moduleSize = codeWidth / columns;

        residualSize = moduleSize - floor(moduleSize);

        moduleSize -= residualSize;
        moduleWidth = moduleSize;
        moduleHeight = moduleSize;

        codeWidth -= residualSize * columns;
        paddingWidth = width - codeWidth;
        codeHeight = moduleSize * lines;

        if (settings.hri.show) {
          height = codeHeight + paddingHeight + hriHeight;
        } else {
          height = codeHeight + paddingHeight;
        }
      } else {
        // keep width and height defined in settings
        ({ width, height } = settings);

        ({
          marginTop,
          fontSize,
          hriHeight,
          paddingWidth,
          paddingHeight,
        } = checkPaddingAndHriHeight({
          fontSize,
          marginTop,
          paddingWidth,
          paddingHeight,
          width,
          height,
        }));

        if (settings.hri.show) {
          codeWidth = width - paddingWidth - (hriHeight * 2);
        } else {
          codeWidth = width - paddingWidth;
        }

        let moduleSize = codeWidth / columns;

        residualSize = moduleSize - floor(moduleSize);

        moduleSize -= residualSize;
        moduleWidth = moduleSize;
        moduleHeight = moduleSize;

        codeWidth -= residualSize * columns;
        codeHeight = moduleSize * lines;

        paddingWidth = width - codeWidth;
        paddingHeight = height - codeHeight;
      }
    } else {
      // square
      width = min(settings.width, settings.height);
      height = width;

      ({
        marginTop,
        fontSize,
        hriHeight,
        paddingWidth,
        paddingHeight,
      } = checkPaddingAndHriHeight({
        fontSize,
        marginTop,
        paddingWidth,
        paddingHeight,
        width,
        height,
      }));

      if (settings.hri.show) {
        codeWidth = width - paddingWidth - (hriHeight * 2);
        codeHeight = height - paddingHeight - (hriHeight * 2);
      } else {
        codeWidth = width - paddingWidth;
        codeHeight = height - paddingHeight;
      }

      // calc residual size for 2D codes or it causes white spaces between blocks
      let moduleSize = min(codeWidth / columns, codeHeight / lines);

      residualSize = moduleSize - floor(moduleSize);

      moduleSize -= residualSize;
      moduleWidth = moduleSize;
      moduleHeight = moduleSize;

      codeWidth -= residualSize * columns;
      codeHeight -= residualSize * lines;

      paddingWidth = width - codeWidth;
      paddingHeight = height - codeHeight;
    }
  } else {
    // 1D codes
    /* eslint no-lonely-if: "off" */
    if (settings.original1DSize) {
      codeWidth = settings.barWidth * columns;
      codeHeight = settings.barHeight * lines;
      width = codeWidth + paddingWidth;

      if (settings.hri.show) {
        height = codeHeight + hriHeight + paddingHeight;
      } else {
        height = codeHeight + paddingHeight;
      }

      moduleWidth = settings.barWidth;
      moduleHeight = settings.barHeight;
    } else {
      ({ width, height } = settings);

      ({
        marginTop,
        fontSize,
        hriHeight,
        paddingWidth,
        paddingHeight,
      } = checkPaddingAndHriHeight({
        fontSize,
        marginTop,
        paddingWidth,
        paddingHeight,
        width,
        height,
      }));

      codeWidth = width - paddingWidth;

      if (settings.hri.show) {
        codeHeight = height - hriHeight - paddingHeight;
      } else {
        codeHeight = height - paddingHeight;
      }

      moduleWidth = codeWidth / columns;
      moduleHeight = codeHeight / lines;
    }
  }

  debug('digitToSvg calculation result:');
  debug({
    width,
    codeWidth,
    moduleWidth,
    paddingWidth,
    columns,
    height,
    codeHeight,
    moduleHeight,
    paddingHeight,
    hri: {
      marginTop,
      fontSize,
    },
    lines,
    residualSize,
  });

  // svg header
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="${width}" height="${height}" shape-rendering="crispEdges">`;

  // background
  svg += `<rect width="${width}" height="${height}" x="0" y="0" fill="${settings.bgColor}" />`;

  // center the code depending on padding width and padding height
  svg += `<g transform="translate(${floor(paddingWidth / 2)} ${floor(paddingHeight / 2)})">`;

  const bar = `<rect width="&W" height="${moduleHeight}" x="&X" y="&Y" fill="${settings.color}" />`;

  for (let y = 0, len = 0; y < lines; y += 1) {
    let currentDigit = digitToConvert[y][0];

    for (let x = 0; x < columns; x += 1) {
      if (currentDigit === digitToConvert[y][x]) {
        len += 1;
      } else {
        if (int(currentDigit) === 1) {
          svg += bar.replace('&W', len * moduleWidth).replace('&X', (x - len) * moduleWidth).replace('&Y', y * moduleHeight);
        }

        currentDigit = digitToConvert[y][x];
        len = 1;
      }
    }

    if (len > 0 && int(currentDigit) === 1) {
      svg += bar.replace('&W', len * moduleWidth).replace('&X', (columns - len) * moduleWidth).replace('&Y', y * moduleHeight);
    }
  }

  if (settings.hri.show) {
    svg += `<g transform="translate(${floor(codeWidth / 2)} ${round(codeHeight + hriHeight + (residualSize * lines / 2))})">`;
    /**
     * font-size-adjust="0.72" to be added below when font-size-adjust will be supported
     * by all browser and remove the fontSizeRatio calculation
     */
    svg += `<text text-anchor="middle" lengthAdjust="spacingAndGlyphs" style="font-family: '${settings.hri.fontFamily}'; font-size: ${fontSize * fontSizeRatio}px;" fill="${settings.color}">${hri}</text>`;
    svg += '</g>';
  }

  // footer
  svg += '</g></svg>';

  return { svg, width, height };
};

module.exports = Object.freeze({
  bitStringTo2DArray,
  checkPaddingAndHriHeight,
  digitToSvg,
});
