/**
 * Font helper.
 * Based on cssfontstack.com.
 *
 *    - getSafeFont(font) -> String or undefined
 */
const { is } = require('./object');

/**
 * As font-size-adjust is only implemented on Firefox, it is needed to use the
 * font size ratio to adjust the height ang have a working marginTop feature.
 *
 * Once font-size-adjust will be implemented in every browser the proper value
 * is 0.72. The modification must be made in barcode helper (digitToSvg function).
 */
const fontsSizeRatio = {
  // sans-serif
  'Sans-serif': 1.48,
  Arial: 1.48,
  'Arial Black': 1.38,
  'Arial Narrow': 1.38,
  'Arial Rounded MT Bold': 1.38,
  'Avant Garde': 1.48,
  Calibri: 1.48,
  Candara: 1.48,
  'Century Gothic': 1.48,
  'Franklin Gothic Medium': 1.48,
  Futura: 1.3,
  Geneva: 1.3,
  'Gill Sans': 1.48,
  Helvetica: 1.42,
  Impact: 1.24,
  'Lucida Grande': 1.38,
  Optima: 1.48,
  'Segoe UI': 1.48,
  Tahoma: 1.38,
  'Trebuchet MS': 1.38,
  Verdana: 1.36,

  // serif
  Serif: 1.48,
  // 'Big Caslon': 1, strange behavior with numbers
  'Bodoni MT': 1.48,
  'Book Antiqua': 1.48,
  'Calisto MT': 1.48,
  Cambria: 1.48,
  Didot: 1.38,
  Garamond: 1.48,
  // 'Georgia': 1, strange behavior with numbers
  'Goudy Old Style': 1.48,
  // 'Hoefler Text': 1, strange behavior with numbers
  'Lucida Bright': 1.48,
  Palatino: 1.48,
  Perpetua: 1.48,
  Rockwell: 1.48,
  'Rockwell Extra Bold': 1.48,
  Baskerville: 1.54,
  'Times New Roman': 1.48,

  // monospaced
  Consolas: 1.48,
  'Courier New': 1.6,
  'Lucida Console': 1.48,
  'Lucida Sans Typewriter': 1.48,
  Monaco: 1.3,
  'Andale Mono': 1.42,

  // fantasy
  Copperlate: 1.48,
  Papyrus: 1.54,

  // script
  'Brush Script MT': 1.66,
};

const getSafeFont = function getSafeFont(font) {
  let name;

  if (is(String, font)) {
    const fontLowerCase = font.toLowerCase();

    Object.keys(fontsSizeRatio).some((fontName) => {
      if (fontName.toLowerCase() === fontLowerCase) {
        name = fontName;
        return true;
      }

      return false;
    });
  }

  return name;
};

module.exports = Object.freeze({
  getSafeFont,
  fontsSizeRatio,
});
