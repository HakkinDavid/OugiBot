var should = require('should');
var randomCase = require('../src/randomCase');


var tests = {
  'should raise an exception when called without arguments': function() {
    randomCase.should.throw(Error, {
      message: 'No arguments passed to randomCase. Usage: randomCase(string)'
    });
  },


  'should raise an error when passed a non-string argument': function () {
    var fn = function() {
      randomCase(5);
    };

    fn.should.throw(Error, {
      message: 'Invalid input type for randomCase. ' +
               'The input should be a string'
    });
  },


  'should not raise exceptions when passed a string': function() {
    var fn = function() {
      randomCase('a');
    };

    fn.should.not.throw();
  },


  'should be truly random': function() {
    var upperCaseCount = 0;
    var lowerCaseCount = 0;
    var distribution;
    var i;

    for (i = 0; i < 100000; i++) {
      if (randomCase('a') === 'a') {
        lowerCaseCount++;
      } else {
        upperCaseCount++;
      }
    }

    distribution = Math.abs(upperCaseCount / lowerCaseCount);
    distribution.should.be.approximately(1, 0.02);
  }
};


module.exports = { randomCase: tests };
