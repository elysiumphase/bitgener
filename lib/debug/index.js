/**
 * debugger, made simple
 */
const Debugger = require('./Debugger');
const { is, hasOwn } = require('../helpers/object');

const mainDebuggerName = 'debug';
const loggers = {
  main: new Debugger(mainDebuggerName, 'yellow'),
};

const getDebugger = function getDebugger(name) {
  let logger;

  if (hasOwn(loggers, name)) {
    logger = loggers[name];
  } else if (is(String, name) && name.trim() !== mainDebuggerName) {
    loggers[name] = new Debugger(name);
    logger = loggers[name];
  } else {
    logger = loggers.main;
  }

  return function debug(...args) {
    logger.debug(...args);
  };
};

module.exports = getDebugger;
