/**
 * Debugger
 *
 *  - name: String
 *  - color: String
 *  - canDebug: Boolean
 *  - previousTime: Number
 *  - timeBetween: Number
 *
 *  - constructor(name, color)
 *  - setName(name) -> undefined
 *  - setColor(color) -> undefined
 *  - setCanDebug() -> undefined
 *  - getOutput(...args) -> String
 *  - updateTimeBetweenTwoDebugs() -> undefined
 *  - debug(...args) -> undefined
 */

const { isatty } = require('tty');
const { format } = require('util');
const { is, hasOwn } = require('../helpers/object');
const { unknownDebuggerName } = require('./config');
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
    this.setCanDebug();
  }

  setName(name) {
    if (is(String, name) && name.trim() !== '') {
      this.name = name;
    } else {
      this.name = unknownDebuggerName;
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

  // no hot reload in Node.js so set the variable when creating object instance
  setCanDebug() {
    const envDebug = process.env.DEBUG;
    this.canDebug = false;

    if (is(String, envDebug)) {
      const modules = envDebug.split(/\s*,\s*/);
      const modulesLen = modules.length;

      for (let i = 0; i < modulesLen; i += 1) {
        if (modules[i] === '*') {
          this.canDebug = true;
        } else {
          const [name, subModule] = this.name.split(':');
          const [debugName, debugSubModule] = modules[i].split(':');

          if (debugName === `-${name}` && (debugSubModule === subModule || debugSubModule === '*')) {
            this.canDebug = false;
            break;
          } else if (modules[i] === `${name}:*` || modules[i] === this.name) {
            this.canDebug = true;
          }
        }
      }
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
    this.updateTimeBetweenTwoDebugs();

    if (this.canDebug) {
      process.stderr.write(`${this.getOutput(...args)}`);
    }
  }
}

module.exports = Debugger;
