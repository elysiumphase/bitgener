const Datamatrix = require('./Datamatrix');

const generate = function generate(data, isRectangular) {
  return {
    digit: new Datamatrix(data, isRectangular).getDatamatrix(),
    hri: data,
  };
};

module.exports = Object.freeze({ generate });
