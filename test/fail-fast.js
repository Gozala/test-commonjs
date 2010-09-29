'use strict'

var $ = require('assert')
,   run = require('test').run

exports['test:pass'] = function(assert) {
  run(
    { mute: true,
      'test:pass': function() {
        $.equal(1, 1, 'Must be equal')
      }
    }
  , function(result) {
      assert.equal(result.passes.length, 1, 'Must pass one test')
      assert.equal(result.fails.length, 0, 'Must not fail any test')
      assert.equal(result.errors.length, 0, 'Must not contain any errors')
    }
  )
}

exports['test:failure'] = function(assert) {
  run(
    { mute: true
    , 'test:must fail': function() {
        $.equal(1, 2, 'Must be two')
      }
    }
  , function(result) {
      assert.equal(result.passes.length, 0, 'Must not pass any test')
      assert.equal(result.fails.length, 1, 'Must fail one test')
      assert.equal(result.errors.length, 0, 'Must not contain any errors')
    }
  )
}

exports['test:error'] = function(assert) {
  run(
    { mute: true
    , 'test:must throw': function() {
        throw new Error('Sorry, but you have to see error & it is not a failure')
      }
    }
  , function(result) {
      assert.equal(result.passes.length, 0, 'Must not pass any test')
      assert.equal(result.fails.length, 0, 'Must not fail any test')
      assert.equal(result.errors.length, 1, 'Must contain one error')
    }
  )
}

/*
exports['test:pseudo async throws'] = function(test, done) {
  run(
    { 'test:must throw': function() {
      throw new Error('Sorry, but you have to see error & it is not a failure')
    }}
  , function(result) {
      test(assert.equal, result.passes.length, 0, 'Must not pass any test')
      test(assert.equal, result.fails.length, 0, 'Must not fail any test')
      test(assert.equal, result.errors.length, 1, 'Must contain one error')
      done()
      return false
    }
  )
}
 
 exports['test:pseudo async throws'] = function(test, done) {
  run(
    { 'test:must throw': function() {
      throw new Error('Sorry, but you have to see error & it is not a failure')
    }}
  , function(result) {
      test(assert.equal, result.passes.length, 0, 'Must not pass any test')
      test(assert.equal, result.fails.length, 0, 'Must not fail any test')
      test(assert.equal, result.errors.length, 1, 'Must contain one error')
      done()
      return false
    }
  )
}

exports['test:async throws'] = function(test, done) {
  run(
    { 'test:must throw': function() {
      throw new Error('Sorry, but you have to see error & it is not a failure')
    }}
  , function(result) {
      setTimeout(function() {
        test(assert.equal, result.passes.length, 0, 'Must not pass any test')
        test(assert.equal, result.fails.length, 0, 'Must not fail any test')
        test(assert.equal, result.errors.length, 1, 'Must contain one error')
        done()
      })
      return false
    }
  )
}
*/
 
if (module == require.main) run(exports)


