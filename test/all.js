'use strict'

var assert = require('assert')
var run = require('test').run

exports['test:pass'] = function(test) {
  run(
    { 'test:pass': function() {
      assert.equal(1, 1, 'Must be equal')
    }}
  , function(result) {
      test(assert.equal, result.passes.length, 1, 'Must pass one test')
      test(assert.equal, result.fails.length, 0, 'Must not fail any test')
      test(assert.equal, result.errors.length, 0, 'Must not contain any errors')
      return false
    }
  )
}

exports['test:failure'] = function(test) {
  run(
    { 'test:must fail': function() {
      assert.equal(1, 2, 'Must be two')
    }}
  , function(result) {
      test(assert.equal, result.passes.length, 0, 'Must not pass any test')
      test(assert.equal, result.fails.length, 1, 'Must fail one test')
      test(assert.equal, result.errors.length, 0, 'Must not contain any errors')
      return false
    }
  )
}

exports['test:error'] = function(test) {
  run(
    { 'test:must throw': function() {
      throw new Error('Sorry, but you have to see error & it is not a failure')
    }}
  , function(result) {
      test(assert.equal, result.passes.length, 0, 'Must not pass any test')
      test(assert.equal, result.fails.length, 0, 'Must not fail any test')
      test(assert.equal, result.errors.length, 1, 'Must contain one error')
      return false
    }
  )
}

run(exports)

