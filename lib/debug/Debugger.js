/**
 * Debugger
 *
 *  - name: String
 *  - color: String
 *  - previousTime: Number
 *  - timeBetween: Number
 *
 *  - constructor(name, color)
 *  - setName(name) -> undefined | throw Error
 *  - setColor(color) -> undefined
 *  - getOutput(...args) -> String
 *  - updateTimeBetweenTwoDebugs() -> undefined
 *  - debug(...args) -> undefined
 */

const { isatty } = require('tty');
const { format } = require('util');
const { isEmptyOwn, is, hasOwn } = require('../helpers/object');
const {
  colors,
  restrictedColors,
  set,
  reset,
} = require('./font');

class Debugger {
  constructor(name, color) {
    this.setName(name);
    this.setColor(color);
  }

  setName(name) {
    if (!isEmptyOwn(name)) {
      this.name = name;
    } else {
      throw new Error('bad debugger name');
    }
  }

  setColor(color) {
    if (hasOwn(colors, color)) {
      this.color = colors[color];
    } else {
      const colorNames = Object.keys(colors);

      this.color = colors[colorNames[Math.floor(Math.random() * colorNames.length)]];
    }
  }

  getOutput(...args) {
    const formatedArgs = format(...args);
    let output = '';

    // prefix, content and time between two calls (determined when debug is called)
    if (isatty(process.stderr.fd)) {
      output += `${set.bold}${this.color}${this.name}${reset.all}`;
      output += ` ${restrictedColors.darkGray}${formatedArgs}${reset.all}`;
      output += ` ${set.bold}${this.color}+${this.timeBetween}ms${reset.all}`;
    } else {
      output += `${new Date().toISOString()} ${this.name}`;
      output += ` ${formatedArgs}`;
      output += ` +${this.timeBetween}ms`;
    }

    // end
    output += '\n';

    return output;
  }

  updateTimeBetweenTwoDebugs() {
    // calculate time between two debug calls
    const currentTime = Date.now();

    if (this.previousTime === undefined) {
      this.previousTime = currentTime;
    }

    this.timeBetween = currentTime - this.previousTime;
    this.previousTime = currentTime;
  }

  debug(...args) {
    const envDebug = process.env.DEBUG;

    this.updateTimeBetweenTwoDebugs();

    if (is(String, envDebug)
      && (envDebug === '*'
        || envDebug === this.name
        || (envDebug[envDebug.length - 1] === '*' && this.name.indexOf(envDebug.substring(0, envDebug.length - 1)) !== -1))) {
      process.stderr.write(`${this.getOutput(...args)}`);
    }
  }
}

module.exports = Debugger;
