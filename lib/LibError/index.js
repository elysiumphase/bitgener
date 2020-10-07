const { is, exists } = require('../helpers/object');
const Codes = require('./Codes');

class LibError extends Error {
  constructor({ code, message, name } = {}) {
    super();
    this.setCode(code);
    this.setMessage(message);
    this.setName(name);
  }

  setCode(value) {
    if (is(String, value) && (exists(Codes[value]))) {
      this.code = value;
    } else {
      throw new Error(`Invalid error code '${value}'`);
    }
  }

  setMessage(value) {
    if (is(String, value)) {
      this.message = value;
    } else {
      this.message = Codes[this.code].message;
    }
  }

  setName(value) {
    if (is(String, value)) {
      this.name = value;
    } else {
      this.name = Codes[this.code].name;
    }
  }

  toString() {
    let libErrorStr = `${this.name} (${this.code})`;

    if (is(String, this.message) && this.message.trim() !== '') {
      libErrorStr += `: ${this.message}`;
    }

    return libErrorStr;
  }
}

LibError.Codes = Codes;

module.exports = LibError;
