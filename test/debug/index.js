const { expect } = require('../Common');
const getDebugger = require('../../lib/debug/index');
const Debugger = require('../../lib/debug/Debugger');
const { mainDebuggerName } = require('../../lib/debug/config');
const { colors } = require('../../lib/debug/font');

const { debuggers } = getDebugger;

describe('#debug index', function() {
  context('when requiring the debug module', function() {
    it('should be a function called getDebugger', function() {
      expect(getDebugger).to.be.a('function');
      expect(getDebugger.name).to.equal('getDebugger');
    });
  });

  context('when using getDebugger function', function() {
    const debuggerName = 'myDebugger';
    const debuggerColorName = 'myColoredDebugger';
    const debuggerRandomColorName = 'myRandomColoredDebugger';
    const debugFunctionWithDebuggerName = getDebugger(debuggerName);
    const debugFunctionWithDebuggerNameAndColor = getDebugger(debuggerColorName, 'red');
    const debugFunctionWithDebuggerRandomColor = getDebugger(debuggerRandomColorName);
    const debugFunctionNoDebuggerName = getDebugger();

    it('should return a debug function if a debugger name is provided', function() {
      expect(debugFunctionWithDebuggerName).to.be.a('function');
      expect(debugFunctionWithDebuggerName.name).to.equal('debug');
    });

    it('should return a debug function if no name is provided', function() {
      const debugFunction = getDebugger('myDebugger');
      expect(debugFunctionNoDebuggerName).to.be.a('function');
      expect(debugFunctionNoDebuggerName.name).to.equal('debug');
    });

    it('should have a main debugger', function() {
      expect(debuggers.main).to.exist;
      expect(debuggers.main.constructor).to.equal(Debugger);
      expect(debuggers.main.name).to.equal(mainDebuggerName);
      expect(debuggers.main.color).to.equal(colors.red);
    });

    it('should add a debugger with the specific name when calling getDebugger', function() {
      expect(debuggers.myDebugger).to.exist;
      expect(debuggers.myDebugger.constructor).to.equal(Debugger);
      expect(debuggers.myDebugger.name).to.equal(debuggerName);
    });

    it('should add a debugger with the specificied color when calling getDebugger', function() {
      expect(debuggers.myColoredDebugger).to.exist;
      expect(debuggers.myColoredDebugger.constructor).to.equal(Debugger);
      expect(debuggers.myColoredDebugger.name).to.equal(debuggerColorName);
      expect(debuggers.myColoredDebugger.color).to.equal(colors.red);
    });

    it('should add a debugger with a random color when calling getDebugger without any color', function() {
      expect(debuggers.myRandomColoredDebugger).to.exist;
      expect(debuggers.myRandomColoredDebugger.constructor).to.equal(Debugger);
      expect(debuggers.myRandomColoredDebugger.name).to.equal(debuggerRandomColorName);
      expect(debuggers.myRandomColoredDebugger.color).to.not.equal(colors.red);
    });
  });
});
