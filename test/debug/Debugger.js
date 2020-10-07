const { expect } = require('../Common');
const Debugger = require('../../lib/debug/Debugger');
const { unknownDebuggerName } = require('../../lib/debug/config');
const { set, reset, restrictedColors, colors } = require('../../lib/debug/font');
const initialDebugEnv = process.env.DEBUG;

describe('#debug Debugger', function() {
  context('when creating a new debugger', function() {
    it('should create a debugger with the specific name and color if provided', function() {
      const myDebugger = new Debugger('my-debugger', 'red');
      expect(myDebugger.constructor).to.equal(Debugger);
      expect(myDebugger.name).to.be.a('string').and.to.equal('my-debugger');
      expect(myDebugger.color).to.be.a('string').and.to.equal(colors.red);
    });

    it('should create a debugger with the specific name and a random color if not provided or unknown', function() {
      const myDebugger1 = new Debugger('my-debugger', 'purple');
      const myDebugger2 = new Debugger('my-debugger');
      expect(myDebugger1.constructor).to.equal(Debugger);
      expect(myDebugger1.constructor).to.equal(Debugger);
      expect(myDebugger1.name).to.be.a('string').and.to.equal('my-debugger');
      expect(myDebugger1.color).to.be.a('string');
      expect(myDebugger2.name).to.be.a('string').and.to.equal('my-debugger');
      expect(myDebugger2.color).to.be.a('string');
    });

    it('should create an unknown debugger when creating a debugger if the name is not a string', function() {
      expect(new Debugger(10).name).to.be.a('string').and.to.equal(unknownDebuggerName);
      expect(new Debugger(true).name).to.be.a('string').and.to.equal(unknownDebuggerName);
      expect(new Debugger([]).name).to.be.a('string').and.to.equal(unknownDebuggerName);
      expect(new Debugger(null).name).to.be.a('string').and.to.equal(unknownDebuggerName);
      expect(new Debugger(undefined).name).to.be.a('string').and.to.equal(unknownDebuggerName);
      expect(new Debugger(NaN).name).to.be.a('string').and.to.equal(unknownDebuggerName);
    });
  });

  context('when setting name', function() {
    it('should set the specific name', function() {
      const myDebugger = new Debugger('my-debugger', 'red');
      myDebugger.setName('new-name');
      expect(myDebugger.name).to.be.a('string').and.to.equal('new-name');
    });

    it('should create an unknown debugger when setting non-string name', function() {
      const myDebugger = new Debugger('my-debugger', 'red');
      expect(myDebugger.name).to.be.a('string').and.to.equal('my-debugger');

      myDebugger.setName(10);
      expect(myDebugger.name).to.be.a('string').and.to.equal(unknownDebuggerName);

      myDebugger.setName(true);
      expect(myDebugger.name).to.be.a('string').and.to.equal(unknownDebuggerName);

      myDebugger.setName([]);
      expect(myDebugger.name).to.be.a('string').and.to.equal(unknownDebuggerName);

      myDebugger.setName(null);
      expect(myDebugger.name).to.be.a('string').and.to.equal(unknownDebuggerName);

      myDebugger.setName(undefined);
      expect(myDebugger.name).to.be.a('string').and.to.equal(unknownDebuggerName);

      myDebugger.setName(NaN);
      expect(myDebugger.name).to.be.a('string').and.to.equal(unknownDebuggerName);
    });
  });

  context('when setting color', function() {
    it('should set the specific color', function() {
      const myDebugger = new Debugger('my-debugger', 'red');
      myDebugger.setColor('green');
      expect(myDebugger.color).to.be.a('string').and.to.equal('\x1b[32m');
    });

    it('should set a random color if color is missing or unknown', function() {
      const myDebugger = new Debugger('my-debugger', 'green');
      myDebugger.setColor('purple');
      expect(myDebugger.color).to.be.a('string').and.to.not.equal('\x1b[32m');
    });
  });

  context('when getting output text', function() {
    // atty only
    it('should return the specific output', function() {
      const myDebugger = new Debugger('my-debugger', 'red');
      // undefinedms because time is being updated between two debugs not in getOutput
      // there won't be any undefined value when properly running the debugger
      expect(myDebugger.getOutput('hello')).to.be.a('string').and.to.equal(`${set.bold}${colors.red}my-debugger${reset.all} ${restrictedColors.darkGray}hello${reset.all} ${set.bold}${colors.red}+undefinedms${reset.all}\n`);
    });
  });

  const sleep = function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  };

  context('when using updateTimeBetweenTwoDebugs', function() {
    it('should set the difference time in ms between two calls and update previous time', async function() {
      const myDebugger = new Debugger('my-debugger', 'red');
      const now = Date.now();
      myDebugger.updateTimeBetweenTwoDebugs();
      expect(myDebugger.previousTime).to.be.a('number').and.to.be.at.least(now).and.to.be.below(now + 15);
      expect(myDebugger.timeBetween).to.be.a('number').and.to.equal(0);

      await sleep(1500);

      myDebugger.updateTimeBetweenTwoDebugs();
      expect(myDebugger.previousTime).to.be.a('number').and.to.be.at.least(now + 1500).and.to.be.below(now + 1515);
      expect(myDebugger.timeBetween).to.be.a('number').and.to.at.least(1500).and.below(1515);
    });
  });

  context('when using setCanDebug', function() {
    it('should return true if DEBUG includes the debugger name', function() {
      const myDebugger = new Debugger('my-debugger', 'red');

      process.env.DEBUG = '*';
      myDebugger.setCanDebug();
      expect(myDebugger.canDebug).to.be.a('boolean').and.to.be.true;

      process.env.DEBUG = 'my-debugger';
      myDebugger.setCanDebug();
      expect(myDebugger.canDebug).to.be.a('boolean').and.to.be.true;

      process.env.DEBUG = 'my-debugger:*';
      myDebugger.setCanDebug();
      expect(myDebugger.canDebug).to.be.a('boolean').and.to.be.true;

      process.env.DEBUG = '*,my-debugger:*';
      myDebugger.setCanDebug();
      expect(myDebugger.canDebug).to.be.a('boolean').and.to.be.true;

      process.env.DEBUG = '*,my-debugger';
      myDebugger.setCanDebug();
      expect(myDebugger.canDebug).to.be.a('boolean').and.to.be.true;
    });

    it('should return false if DEBUG excludes the debugger name', function() {
      const myDebugger = new Debugger('my-debugger', 'red');

      process.env.DEBUG = '*,-my-debugger:*';
      myDebugger.setCanDebug();
      expect(myDebugger.canDebug).to.be.a('boolean').and.to.be.false;

      process.env.DEBUG = '-my-debugger:*';
      myDebugger.setCanDebug();
      expect(myDebugger.canDebug).to.be.a('boolean').and.to.be.false;

      process.env.DEBUG = '*,-my-debugger';
      myDebugger.setCanDebug();
      expect(myDebugger.canDebug).to.be.a('boolean').and.to.be.false;
    });

    after(function() {
      process.env.DEBUG = initialDebugEnv;
    });
  });
});
