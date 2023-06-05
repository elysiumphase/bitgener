const { expect } = require('../Common');
const LibError = require('../../src/LibError');

describe('#LibError', function() {
  context('when using format', function() {
    it('should return the exact same error if already a LibError', function() {
      const libError = new LibError();
      const error = LibError.format(libError);

      expect(error).to.equals(libError);
    });

    it('should return an unknown error when the error is null', function() {
      const error = LibError.format(null);

      expect(error).to.be.an('error');
      expect(error.code).to.equals('UNKNOWN_ERROR');
      expect(error.message).to.equals('unknown error');
      expect(error.name).to.equals('LibError');
      expect(error.constructor.name).to.equals('LibError');
    });

    it('should return an unknown error when the error is undefined', function() {
      const error = LibError.format(undefined);

      expect(error).to.be.an('error');
      expect(error.code).to.equals('UNKNOWN_ERROR');
      expect(error.message).to.equals('unknown error');
      expect(error.name).to.equals('LibError');
      expect(error.constructor.name).to.equals('LibError');
    });

    it('should return an unknown error when the error is NaN', function() {
      const error = LibError.format(NaN);

      expect(error).to.be.an('error');
      expect(error.code).to.equals('UNKNOWN_ERROR');
      expect(error.message).to.equals('unknown error');
      expect(error.name).to.equals('LibError');
      expect(error.constructor.name).to.equals('LibError');
    });

    it('should return an unknown error when the error is not a lib error and has no message', function() {
      const error = LibError.format(new Error());

      expect(error).to.be.an('error');
      expect(error.code).to.equals('UNKNOWN_ERROR');
      expect(error.message).to.equals('unknown error');
      expect(error.name).to.equals('LibError');
      expect(error.constructor.name).to.equals('LibError');
    });

    it('should return an unknown error when the error is not a lib error and the message is undefined', function() {
      const error = LibError.format(new Error(undefined));

      expect(error).to.be.an('error');
      expect(error.code).to.equals('UNKNOWN_ERROR');
      expect(error.message).to.equals('unknown error');
      expect(error.name).to.equals('LibError');
      expect(error.constructor.name).to.equals('LibError');
    });

    it('should return an unknown error when the error is not a lib error and the message is NaN', function() {
      const error = LibError.format(new Error(NaN));

      expect(error).to.be.an('error');
      expect(error.code).to.equals('UNKNOWN_ERROR');
      expect(error.message).to.equals('unknown error');
      expect(error.name).to.equals('LibError');
      expect(error.constructor.name).to.equals('LibError');
    });

    it('should return an unknown error when the error is not a lib error and the message is null', function() {
      const error = LibError.format(new Error(null));

      expect(error).to.be.an('error');
      expect(error.code).to.equals('UNKNOWN_ERROR');
      expect(error.message).to.equals('unknown error');
      expect(error.name).to.equals('LibError');
      expect(error.constructor.name).to.equals('LibError');
    });

    it('should return an unknown error when the error is not a lib error and the message is empty', function() {
      const error = LibError.format(new Error(''));

      expect(error).to.be.an('error');
      expect(error.code).to.equals('UNKNOWN_ERROR');
      expect(error.message).to.equals('unknown error');
      expect(error.name).to.equals('LibError');
      expect(error.constructor.name).to.equals('LibError');
    });

    it('should return an unknown error when the error is not a lib error and the message only has blank spaces', function() {
      const error = LibError.format(new Error('       '));

      expect(error).to.be.an('error');
      expect(error.code).to.equals('UNKNOWN_ERROR');
      expect(error.message).to.equals('unknown error');
      expect(error.name).to.equals('LibError');
      expect(error.constructor.name).to.equals('LibError');
    });

    it('should return an unknown error with the origin error\'s code/message/name as a message if not a standard error and having the origin error stack', function() {
      let err = new URIError('uri not available');
      let error = LibError.format(err);

      expect(error).to.be.an('error');
      expect(error.code).to.equals('UNKNOWN_ERROR');
      expect(error.message).to.equals('uri not available');
      expect(error.name).to.equals('LibError');
      expect(error.constructor.name).to.equals('LibError');
      expect(error.originStack).to.be.a('string').and.to.equals(`\n${err.stack}`);
      expect(error.toString()).to.be.a('string').and.to.include(error.stack);
      expect(error.toString()).to.be.a('string').and.to.include(err.stack);

      err = new URIError();
      error = LibError.format(err);

      expect(error).to.be.an('error');
      expect(error.code).to.equals('UNKNOWN_ERROR');
      expect(error.message).to.equals('URIError');
      expect(error.name).to.equals('LibError');
      expect(error.constructor.name).to.equals('LibError');
      expect(error.originStack).to.be.a('string').and.to.equals(`\n${err.stack}`);
      expect(error.toString()).to.be.a('string').and.to.include(error.stack);
      expect(error.toString()).to.be.a('string').and.to.include(err.stack);

      err = new Error();
      error = LibError.format(err);

      expect(error).to.be.an('error');
      expect(error.code).to.equals('UNKNOWN_ERROR');
      expect(error.message).to.equals('unknown error');
      expect(error.name).to.equals('LibError');
      expect(error.constructor.name).to.equals('LibError');
      expect(error.originStack).to.be.a('string').and.to.equals(`\n${err.stack}`);
      expect(error.toString()).to.be.a('string').and.to.include(error.stack);
      expect(error.toString()).to.be.a('string').and.to.include(err.stack);

      err = new Error();
      err.code = 'ORIGIN_ERROR_CODE'
      error = LibError.format(err);

      expect(error).to.be.an('error');
      expect(error.code).to.equals('UNKNOWN_ERROR');
      expect(error.message).to.equals('ORIGIN_ERROR_CODE');
      expect(error.name).to.equals('LibError');
      expect(error.constructor.name).to.equals('LibError');
      expect(error.originStack).to.be.a('string').and.to.equals(`\n${err.stack}`);
      expect(error.toString()).to.be.a('string').and.to.include(error.stack);
      expect(error.toString()).to.be.a('string').and.to.include(err.stack);
    });
  });

  context('when creating a new LibError', function() {
    it('should create a lib error with a default code if not specified or unknown', function() {
      const error = new LibError({ code: 'UNKNOWN_CODE' });

      expect(error).to.be.an('error');
      expect(error.code).to.equals('UNKNOWN_ERROR');
      expect(error.message).to.equals('');
      expect(error.name).to.equals('LibError');
      expect(error.constructor.name).to.equals('LibError');
    });

    it('should create a lib error with a default name if not specified or empty', function() {
      let error = new LibError({ name: '' });

      expect(error).to.be.an('error');
      expect(error.code).to.equals('UNKNOWN_ERROR');
      expect(error.message).to.equals('');
      expect(error.name).to.equals('LibError');
      expect(error.constructor.name).to.equals('LibError');

      error = new LibError({ name: '        ' });

      expect(error).to.be.an('error');
      expect(error.code).to.equals('UNKNOWN_ERROR');
      expect(error.message).to.equals('');
      expect(error.name).to.equals('LibError');
      expect(error.constructor.name).to.equals('LibError');
    });

    it('should create a lib error with a specific message if specified or the originError message if any or should be the empty string', function() {
      let error = new LibError({ message: 'unexpected error' });

      expect(error).to.be.an('error');
      expect(error.code).to.equals('UNKNOWN_ERROR');
      expect(error.message).to.equals('unexpected error');
      expect(error.name).to.equals('LibError');
      expect(error.constructor.name).to.equals('LibError');

      error = new LibError({ message: '       ' });

      expect(error).to.be.an('error');
      expect(error.code).to.equals('UNKNOWN_ERROR');
      expect(error.message).to.equals('');
      expect(error.name).to.equals('LibError');
      expect(error.constructor.name).to.equals('LibError');

      error = new LibError({ message: '    message   ' });

      expect(error).to.be.an('error');
      expect(error.code).to.equals('UNKNOWN_ERROR');
      expect(error.message).to.equals('message');
      expect(error.name).to.equals('LibError');
      expect(error.constructor.name).to.equals('LibError');

      error = new LibError({}, new Error('origin error message'));

      expect(error).to.be.an('error');
      expect(error.code).to.equals('UNKNOWN_ERROR');
      expect(error.message).to.equals('origin error message');
      expect(error.name).to.equals('LibError');
      expect(error.constructor.name).to.equals('LibError');

      error = new LibError({}, new Error());

      expect(error).to.be.an('error');
      expect(error.code).to.equals('UNKNOWN_ERROR');
      expect(error.message).to.equals('');
      expect(error.name).to.equals('LibError');
      expect(error.constructor.name).to.equals('LibError');
    });

    it('should create a lib error with a specific code if it exists', function() {
      const error = new LibError({ code: 'WRITABLE_INTERNAL' });

      expect(error).to.be.an('error');
      expect(error.code).to.equals('WRITABLE_INTERNAL');
      expect(error.message).to.equals('');
      expect(error.name).to.equals('LibError');
      expect(error.constructor.name).to.equals('LibError');
    });

    it('should create a lib error with a specific name if not empty', function() {
      const error = new LibError({ name: 'CustomError' });

      expect(error).to.be.an('error');
      // error can have a name but an unknown error code
      expect(error.code).to.equals('UNKNOWN_ERROR');
      expect(error.message).to.equals('');
      expect(error.name).to.equals('CustomError');
      expect(error.constructor.name).to.equals('LibError');
    });

    it('should create a lib error with the origin error stack trace and to be included in toString format', function() {
      const origin = new URIError('bad uri');
      const error = new LibError({}, origin);

      expect(error).to.be.an('error');
      expect(error.code).to.equals('UNKNOWN_ERROR');
      expect(error.message).to.equals('bad uri');
      expect(error.name).to.equals('LibError');
      expect(error.constructor.name).to.equals('LibError');
      expect(error.originStack).to.be.a('string').and.to.equals(`\n${origin.stack}`);
      expect(error.toString()).to.be.a('string').and.to.include(error.stack);
      expect(error.toString()).to.be.a('string').and.to.include(origin.stack);
    });
  });
});
