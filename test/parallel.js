'use strict';
const
  should = require('should'),
  forger = require('../');

describe('#parallel()', function () {
  let parallel = forger.parallel;

  it('should execute all methods and resolve', function (done) {
    let
      counter = 0,
      results = [],
      makeFunc = function (timeout) {
          return function(next) {
            setTimeout(() => {
              results.push(timeout);
              next()
            }, timeout)
          }
      };

    parallel(
      makeFunc(30),
      makeFunc(20),
      makeFunc(10)
    ).then(() => {
      results.should.match([10, 20, 30]).and.be.an.Array();
      done()
    }).catch((err) => {
      done(err)
    })
  });

  it('should reject upon first error', function (done) {
    let
      errMsg = 'Expected error',
      solved = 0,
      goodFn = function (next) { solved++; next() },
      badFn = function (next) { setTimeout(() => {
        next(new Error(errMsg))
      })};

    parallel(goodFn, badFn, goodFn).then(() => {
      throw new Error('Execution error')
    }).catch((err) => {
      try {
        err.message.should.be.exactly(errMsg);
        solved.should.be.exactly(2);
        done()
      } catch (err) {
        done(err)
      }
    })
  })
});
