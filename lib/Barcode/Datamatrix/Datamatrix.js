/**
 * Datamatrix ECC 200 standard implementation.
 *
 * This class is intended to avoid memory leaks and/or garbage collector overusage so we
 * can work on the instance and not passing references into functions creating
 * possible unwanted mutations.
 */
const {
  lengthRows,
  lengthCols,
  dataCWCount,
  solomonCWCount,
  dataRegionRows,
  dataRegionCols,
  regionRows,
  regionCols,
  interleavedBlocks,
} = require('./constants');

const {
  champGaloisMult,
  champGaloisDoub,
  champGaloisSum,
  selectIndex,
  encodeDataCodeWordsASCII,
  getBits,
} = require('./utils');

const { cast: { int } } = require('../../helpers');

/* eslint max-len: "off" */
class Datamatrix {
  constructor(data, isRectangular) {
    // NOTE: data and isRectangular values have been checked in Barcode/index.js entry point
    this.dataCodeWords = encodeDataCodeWordsASCII(data);

    this.nbDataCodeWords = this.dataCodeWords.length;

    // select the index for the data tables
    const index = selectIndex(this.nbDataCodeWords, isRectangular);

    // number of data cw
    this.nbTotalDataCodeWords = dataCWCount[index];

    // number of reed solomon cw
    const nbSolomonCW = solomonCWCount[index];

    // number of cw
    this.totalCWCount = this.nbTotalDataCodeWords + nbSolomonCW;

    // size of symbol
    const rowsTotal = lengthRows[index];
    const colsTotal = lengthCols[index];

    // number of region
    this.rowsRegion = regionRows[index];
    this.colsRegion = regionCols[index];
    this.rowsRegionCW = dataRegionRows[index];
    this.colsRegionCW = dataRegionCols[index];

    // size of matrice data
    this.rowsLengthMatrice = rowsTotal - 2 * this.rowsRegion;
    this.colsLengthMatrice = colsTotal - 2 * this.colsRegion;

    // number of reed solomon blocks
    this.nbBlocks = interleavedBlocks[index];
    this.nbErrorBlocks = (nbSolomonCW / this.nbBlocks);

    // add codewords pads
    this.addCodeWordsPad();

    // calculate the reed solomon factors
    this.genSolomonFactorsTable();

    // add reed solomon codewords
    this.addReedSolomonToCodeWords();

    // generate bits from codewords
    this.genCodeWordsBits();

    // generate a base datamatrix by putting the codewords into the matrix
    this.genDatamatrixBase();

    // generate the final datamatrix by adding the finder pattern based on datamatrixBase
    this.genDatamatrix();

    // free useless properties to be handled by garbage collector
    this.dataCodeWords = undefined;
    this.nbDataCodeWords = undefined;
    this.nbTotalDataCodeWords = undefined;
    this.totalCWCount = undefined;
    this.rowsRegion = undefined;
    this.colsRegion = undefined;
    this.rowsRegionCW = undefined;
    this.colsRegionCW = undefined;
    this.rowsLengthMatrice = undefined;
    this.colsLengthMatrice = undefined;
    this.nbBlocks = undefined;
    this.nbErrorBlocks = undefined;
    this.solomonFactorsTable = undefined;
    this.codeWordsBits = undefined;
    this.datamatrixBase = undefined;
    this.assigned = undefined;
  }

  addCodeWordsPad() {
    if (this.nbDataCodeWords < this.nbTotalDataCodeWords) {
      this.dataCodeWords[this.nbDataCodeWords] = 129;

      for (let i = this.nbDataCodeWords + 1; i < this.nbTotalDataCodeWords; i += 1) {
        const r = ((149 * (i + 1)) % 253) + 1;
        this.dataCodeWords[i] = (129 + r) % 254;
      }
    }
  }

  genSolomonFactorsTable() {
    this.solomonFactorsTable = [];

    for (let i = 0; i <= this.nbErrorBlocks; i += 1) {
      this.solomonFactorsTable[i] = 1;
    }

    for (let i = 1; i <= this.nbErrorBlocks; i += 1) {
      for (let j = i - 1; j >= 0; j -= 1) {
        this.solomonFactorsTable[j] = champGaloisDoub(this.solomonFactorsTable[j], i);

        if (j > 0) {
          this.solomonFactorsTable[j] = champGaloisSum(this.solomonFactorsTable[j], this.solomonFactorsTable[j - 1]);
        }
      }
    }
  }

  addReedSolomonToCodeWords() {
    const correctionCW = [];

    for (let k = 0; k < this.nbBlocks; k += 1) {
      for (let i = 0; i < this.nbErrorBlocks; i += 1) {
        correctionCW[i] = 0;
      }

      for (let i = k; i < this.nbTotalDataCodeWords; i += this.nbBlocks) {
        const galoisFieldSum = champGaloisSum(this.dataCodeWords[i], correctionCW[this.nbErrorBlocks - 1]);

        for (let j = this.nbErrorBlocks - 1; j >= 0; j -= 1) {
          if (galoisFieldSum === 0) {
            correctionCW[j] = 0;
          } else {
            correctionCW[j] = champGaloisMult(galoisFieldSum, this.solomonFactorsTable[j]);
          }

          if (j > 0) {
            correctionCW[j] = champGaloisSum(correctionCW[j - 1], correctionCW[j]);
          }
        }
      }

      // reverse blocks
      for (let i = this.nbErrorBlocks - 1, j = this.nbTotalDataCodeWords + k; i >= 0; i -= 1, j += this.nbBlocks) {
        this.dataCodeWords[j] = correctionCW[i];
      }
    }
  }

  genCodeWordsBits() {
    this.codeWordsBits = [];

    for (let i = 0; i < this.totalCWCount; i += 1) {
      this.codeWordsBits[i] = getBits(this.dataCodeWords[i]);
    }
  }

  genDatamatrixBase() {
    // init the matrix
    this.datamatrixBase = [];
    this.assigned = [];

    for (let i = 0; i < this.colsLengthMatrice; i += 1) {
      this.datamatrixBase[i] = [];
      this.assigned[i] = [];
    }

    // add the bottom-right corner if needed
    if (((this.rowsLengthMatrice * this.colsLengthMatrice) % 8) === 4) {
      this.datamatrixBase[this.rowsLengthMatrice - 2][this.colsLengthMatrice - 2] = 1;
      this.datamatrixBase[this.rowsLengthMatrice - 1][this.colsLengthMatrice - 1] = 1;
      this.datamatrixBase[this.rowsLengthMatrice - 1][this.colsLengthMatrice - 2] = 0;
      this.datamatrixBase[this.rowsLengthMatrice - 2][this.colsLengthMatrice - 1] = 0;
      this.assigned[this.rowsLengthMatrice - 2][this.colsLengthMatrice - 2] = 1;
      this.assigned[this.rowsLengthMatrice - 1][this.colsLengthMatrice - 1] = 1;
      this.assigned[this.rowsLengthMatrice - 1][this.colsLengthMatrice - 2] = 1;
      this.assigned[this.rowsLengthMatrice - 2][this.colsLengthMatrice - 1] = 1;
    }

    // place of the 8th bit from the first character to [4][0]
    const etape = 0;
    let chr = 0;
    let row = 4;
    let col = 0;

    do {
      // check for a special case of corner
      if (row === this.rowsLengthMatrice && col === 0) {
        this.putBitsSpecialPattern1(this.codeWordsBits[chr]);
        chr += 1;
      } else if (etape < 3 && (row === this.rowsLengthMatrice - 2) && col === 0 && (this.colsLengthMatrice % 4 !== 0)) {
        this.putBitsSpecialPattern2(this.codeWordsBits[chr]);
        chr += 1;
      } else if ((row === this.rowsLengthMatrice - 2) && col === 0 && (this.colsLengthMatrice % 8 === 4)) {
        this.putBitsSpecialPattern3(this.codeWordsBits[chr]);
        chr += 1;
      } else if ((row === this.rowsLengthMatrice + 4) && col === 2 && (this.colsLengthMatrice % 8 === 0)) {
        this.putBitsSpecialPattern4(this.codeWordsBits[chr]);
        chr += 1;
      }

      // go up and right in the datamatrix
      do {
        if (row < this.rowsLengthMatrice && col >= 0 && this.assigned[row][col] !== 1) {
          this.putBitsStandardPattern(this.codeWordsBits[chr], row, col);
          chr += 1;
        }

        row -= 2;
        col += 2;
      } while (row >= 0 && col < this.colsLengthMatrice);

      row += 1;
      col += 3;

      // go down and left in the datamatrix
      do {
        if (row >= 0 && col < this.colsLengthMatrice && this.assigned[row][col] !== 1) {
          this.putBitsStandardPattern(this.codeWordsBits[chr], row, col);
          chr += 1;
        }

        row += 2;
        col -= 2;
      } while (row < this.rowsLengthMatrice && col >= 0);

      row += 3;
      col += 1;
    } while (row < this.rowsLengthMatrice || col < this.colsLengthMatrice);
  }

  // put a bit into the base matrix
  // NOTE: row and col must be integer values set in genDatamatrixBase function
  putBitInDatamatrixBase(bit, row, col) {
    let r = row.valueOf();
    let c = col.valueOf();

    if (r < 0) {
      r += this.rowsLengthMatrice;
      c += 4 - ((this.rowsLengthMatrice + 4) % 8);
    }

    if (c < 0) {
      c += this.colsLengthMatrice;
      r += 4 - ((this.colsLengthMatrice + 4) % 8);
    }

    if (this.assigned[r][c] !== 1) {
      this.datamatrixBase[r][c] = bit;
      this.assigned[r][c] = 1;
    }
  }

  // place bits into the base matrix (standard or special case)
  putBitsStandardPattern(bits, row, col) {
    this.putBitInDatamatrixBase(bits[0], row - 2, col - 2);
    this.putBitInDatamatrixBase(bits[1], row - 2, col - 1);
    this.putBitInDatamatrixBase(bits[2], row - 1, col - 2);
    this.putBitInDatamatrixBase(bits[3], row - 1, col - 1);
    this.putBitInDatamatrixBase(bits[4], row - 1, col);
    this.putBitInDatamatrixBase(bits[5], row, col - 2);
    this.putBitInDatamatrixBase(bits[6], row, col - 1);
    this.putBitInDatamatrixBase(bits[7], row, col);
  }

  putBitsSpecialPattern1(bits) {
    this.putBitInDatamatrixBase(bits[0], this.rowsLengthMatrice - 1, 0);
    this.putBitInDatamatrixBase(bits[1], this.rowsLengthMatrice - 1, 1);
    this.putBitInDatamatrixBase(bits[2], this.rowsLengthMatrice - 1, 2);
    this.putBitInDatamatrixBase(bits[3], 0, this.colsLengthMatrice - 2);
    this.putBitInDatamatrixBase(bits[4], 0, this.colsLengthMatrice - 1);
    this.putBitInDatamatrixBase(bits[5], 1, this.colsLengthMatrice - 1);
    this.putBitInDatamatrixBase(bits[6], 2, this.colsLengthMatrice - 1);
    this.putBitInDatamatrixBase(bits[7], 3, this.colsLengthMatrice - 1);
  }

  putBitsSpecialPattern2(bits) {
    this.putBitInDatamatrixBase(bits[0], this.rowsLengthMatrice - 3, 0);
    this.putBitInDatamatrixBase(bits[1], this.rowsLengthMatrice - 2, 0);
    this.putBitInDatamatrixBase(bits[2], this.rowsLengthMatrice - 1, 0);
    this.putBitInDatamatrixBase(bits[3], 0, this.colsLengthMatrice - 4);
    this.putBitInDatamatrixBase(bits[4], 0, this.colsLengthMatrice - 3);
    this.putBitInDatamatrixBase(bits[5], 0, this.colsLengthMatrice - 2);
    this.putBitInDatamatrixBase(bits[6], 0, this.colsLengthMatrice - 1);
    this.putBitInDatamatrixBase(bits[7], 1, this.colsLengthMatrice - 1);
  }

  putBitsSpecialPattern3(bits) {
    this.putBitInDatamatrixBase(bits[0], this.rowsLengthMatrice - 3, 0);
    this.putBitInDatamatrixBase(bits[1], this.rowsLengthMatrice - 2, 0);
    this.putBitInDatamatrixBase(bits[2], this.rowsLengthMatrice - 1, 0);
    this.putBitInDatamatrixBase(bits[3], 0, this.colsLengthMatrice - 2);
    this.putBitInDatamatrixBase(bits[4], 0, this.colsLengthMatrice - 1);
    this.putBitInDatamatrixBase(bits[5], 1, this.colsLengthMatrice - 1);
    this.putBitInDatamatrixBase(bits[6], 2, this.colsLengthMatrice - 1);
    this.putBitInDatamatrixBase(bits[7], 3, this.colsLengthMatrice - 1);
  }

  putBitsSpecialPattern4(bits) {
    this.putBitInDatamatrixBase(bits[0], this.rowsLengthMatrice - 1, 0);
    this.putBitInDatamatrixBase(bits[1], this.rowsLengthMatrice - 1, this.colsLengthMatrice - 1);
    this.putBitInDatamatrixBase(bits[2], 0, this.colsLengthMatrice - 3);
    this.putBitInDatamatrixBase(bits[3], 0, this.colsLengthMatrice - 2);
    this.putBitInDatamatrixBase(bits[4], 0, this.colsLengthMatrice - 1);
    this.putBitInDatamatrixBase(bits[5], 1, this.colsLengthMatrice - 3);
    this.putBitInDatamatrixBase(bits[6], 1, this.colsLengthMatrice - 2);
    this.putBitInDatamatrixBase(bits[7], 1, this.colsLengthMatrice - 1);
  }

  genDatamatrix() {
    const totalRowsCW = (this.rowsRegionCW + 2) * this.rowsRegion;
    const totalColsCW = (this.colsRegionCW + 2) * this.colsRegion;

    this.datamatrix = [];
    this.datamatrix[0] = [];

    for (let j = 0; j < totalColsCW + 2; j += 1) {
      this.datamatrix[0][j] = 0;
    }

    for (let i = 0; i < totalRowsCW; i += 1) {
      this.datamatrix[i + 1] = [];
      this.datamatrix[i + 1][0] = 0;
      this.datamatrix[i + 1][totalColsCW + 1] = 0;

      for (let j = 0; j < totalColsCW; j += 1) {
        if (i % (this.rowsRegionCW + 2) === 0) {
          if (j % 2 === 0) {
            this.datamatrix[i + 1][j + 1] = 1;
          } else {
            this.datamatrix[i + 1][j + 1] = 0;
          }
        } else if (i % (this.rowsRegionCW + 2) === this.rowsRegionCW + 1) {
          this.datamatrix[i + 1][j + 1] = 1;
        } else if (j % (this.colsRegionCW + 2) === this.colsRegionCW + 1) {
          if (i % 2 === 0) {
            this.datamatrix[i + 1][j + 1] = 0;
          } else {
            this.datamatrix[i + 1][j + 1] = 1;
          }
        } else if (j % (this.colsRegionCW + 2) === 0) {
          this.datamatrix[i + 1][j + 1] = 1;
        } else {
          this.datamatrix[i + 1][j + 1] = 0;
          this.datamatrix[i + 1][j + 1] = this.datamatrixBase[i - 1 - (2 * (int(i / (this.rowsRegionCW + 2))))][j - 1 - (2 * (int(j / (this.colsRegionCW + 2))))];
        }
      }
    }

    this.datamatrix[totalRowsCW + 1] = [];

    for (let j = 0; j < totalColsCW + 2; j += 1) {
      this.datamatrix[totalRowsCW + 1][j] = 0;
    }
  }

  getDatamatrix() {
    return this.datamatrix;
  }
}

module.exports = Object.freeze(Datamatrix);
