/**
 * from bugbug https://github.com/adrienv1520/bugbug
 *
 * debugger, made simple
 */
const Debugger = require('./Debugger');
const { is, hasOwn } = require('../helpers/object');
const { mainDebuggerName } = require('./config');

const debuggers = {
  main: new Debugger(mainDebuggerName, 'red'),
};

/**
 * @func getDebugger
 *
 * get the debug function from a stored debugger or get it from a new one
 * @param  {String} name
 * @param  {String} color
 * @return {Function}
 */
const getDebugger = function getDebugger(name, color) {
  let debuggerInstance;

  if (hasOwn(debuggers, name)) {
    debuggerInstance = debuggers[name];
  } else if (is(String, name) && name.trim() !== mainDebuggerName) {
    debuggers[name] = new Debugger(name, color);
    debuggerInstance = debuggers[name];
  } else {
    debuggerInstance = debuggers.main;
  }

  return function debug(...args) {
    debuggerInstance.debug(...args);
  };
};

module.exports = getDebugger;

// for testing only
module.exports.debuggers = debuggers;
