const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  lightRed: '\x1b[91m',
  lightGreen: '\x1b[92m',
  lightYellow: '\x1b[93m',
  lightBlue: '\x1b[94m',
  lightMagenta: '\x1b[95m',
  lightCyan: '\x1b[96m',
};

const restrictedColors = {
  black: '\x1b[30m',
  white: '\x1b[97m',
  darkGray: '\x1b[90m',
  lightGray: '\x1b[37m',
};

const set = {
  bold: '\x1b[1m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underlined: '\x1b[4m',
  blink: '\x1b[5m',
  inverted: '\x1b[7m',
  hidden: '\x1b[8m',
};

const reset = {
  all: '\x1b[0m',
  bold: '\x1b[21m',
  bright: '\x1b[21m',
  dim: '\x1b[22m',
  underlined: '\x1b[24m',
  blink: '\x1b[25m',
  inverted: '\x1b[27m',
  hidden: '\x1b[28m',
};


module.exports = Object.freeze({
  colors,
  restrictedColors,
  set,
  reset,
});
