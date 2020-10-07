const { expect } = require('../Common');
const { color: { isColor } } = require('../../lib/helpers');

describe('#helpers color', function() {
  context('when using isColor', function() {
    it('should return true if the string is a valid hex color code', function() {
      expect(isColor('#8C0354')).to.be.a('boolean').and.to.be.true;
      expect(isColor('#8c0354')).to.be.a('boolean').and.to.be.true;
      expect(isColor('#BBF2DF')).to.be.a('boolean').and.to.be.true;
      expect(isColor('#bbf2df')).to.be.a('boolean').and.to.be.true;
      expect(isColor('#BADA55')).to.be.a('boolean').and.to.be.true;
      expect(isColor('#bada55')).to.be.a('boolean').and.to.be.true;
      expect(isColor('#6495ED')).to.be.a('boolean').and.to.be.true;
      expect(isColor('#6495ed')).to.be.a('boolean').and.to.be.true;
    });

    it('should return true if the string is a valid generic color name', function() {
      expect(isColor('aliceblue')).to.be.a('boolean').and.to.be.true;
      expect(isColor('yellow')).to.be.a('boolean').and.to.be.true;
      expect(isColor('red')).to.be.a('boolean').and.to.be.true;
      expect(isColor('green')).to.be.a('boolean').and.to.be.true;
      expect(isColor('blue')).to.be.a('boolean').and.to.be.true;
      expect(isColor('green')).to.be.a('boolean').and.to.be.true;
      expect(isColor('black')).to.be.a('boolean').and.to.be.true;
      expect(isColor('white')).to.be.a('boolean').and.to.be.true;
      expect(isColor('pink')).to.be.a('boolean').and.to.be.true;
      expect(isColor('purple')).to.be.a('boolean').and.to.be.true;
      expect(isColor('grey')).to.be.a('boolean').and.to.be.true;
      expect(isColor('brown')).to.be.a('boolean').and.to.be.true;
      expect(isColor('salmon')).to.be.a('boolean').and.to.be.true;
      expect(isColor('none')).to.be.a('boolean').and.to.be.true;
    });

    it('should return false if the string is not a valid hex color code', function() {
      expect(isColor('##8C0354')).to.be.a('boolean').and.to.be.false;
      expect(isColor('#8G0354')).to.be.a('boolean').and.to.be.false;
      expect(isColor('#TTF2DF')).to.be.a('boolean').and.to.be.false;
      expect(isColor('#bbf2dx')).to.be.a('boolean').and.to.be.false;
      expect(isColor('')).to.be.a('boolean').and.to.be.false;
      expect(isColor('#bada555')).to.be.a('boolean').and.to.be.false;
    });

    it('should return false if the string is not a valid generic color name', function() {
      expect(isColor('alicebluex')).to.be.a('boolean').and.to.be.false;
      expect(isColor('yellowstone')).to.be.a('boolean').and.to.be.false;
      expect(isColor('redpurple')).to.be.a('boolean').and.to.be.false;
      expect(isColor('greenindian')).to.be.a('boolean').and.to.be.false;
      expect(isColor('bluemonster')).to.be.a('boolean').and.to.be.false;
    });

    it('should return false if the string is empty', function() {
      expect(isColor('')).to.be.a('boolean').and.to.be.false;
    });

    it('should return false if parameter is null', function() {
      expect(isColor(null)).to.be.a('boolean').and.to.be.false;
    });

    it('should return false if parameter is undefined', function() {
      expect(isColor(undefined)).to.be.a('boolean').and.to.be.false;
    });

    it('should return false if parameter is NaN', function() {
      expect(isColor(NaN)).to.be.a('boolean').and.to.be.false;
    });
  });
});
