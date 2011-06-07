/* vim:set ts=2 sw=2 sts=2 expandtab */
/*jshint asi: true newcap: true undef: true es5: true node: true devel: true
         forin: true */
/*global define: true */

(typeof define === "undefined" ? function ($) { $(require, exports, module) } : define)(function (require, exports, module, undefined) {

'use strict';

var $ = require('assert'),
    run = require('../test').run


exports['test that passes'] = function (assert) {
    run({
      mute: true,
      'test fixture': function () {
        $.equal(1, 1, 'Must be equal')
      }
    }, function (result) {
      assert.equal(result.passes.length, 1, 'Must pass one test')
      assert.equal(result.fails.length, 0, 'Must not fail any test')
      assert.equal(result.errors.length, 0, 'Must not contain any errors')
    })
}

exports['test that fails'] = function (assert) {
  run({
    mute: true,
    'test fixture': function () {
      $.equal(1, 2, 'Must be two')
    }
  }, function (result) {
    assert.equal(result.passes.length, 0, 'Must not pass any test')
    assert.equal(result.fails.length, 1, 'Must fail one test')
    assert.equal(result.errors.length, 0, 'Must not contain any errors')
  })
}

exports['test that throws error'] = function (assert) {
  run({
    mute: true,
    'test fixture': function () {
      throw new Error('Boom!!')
    }
  }, function (result) {
    assert.equal(result.passes.length, 0, 'Must not pass any test')
    assert.equal(result.fails.length, 0, 'Must not fail any test')
    assert.equal(result.errors.length, 1, 'Must contain one error')
  })
}

exports['test that passes one assert and fails fast'] = function (assert) {
  run({
    mute: true,
    'test fixture': function ($$) {
      $$.equal(1, 1, 'Must be equal')
      $.equal(1, 2, 'Must fail test')
    }
  }, function (result) {
    assert.equal(result.passes.length, 1, 'Must pass one test')
    assert.equal(result.fails.length, 1, 'Must fail one test')
    assert.equal(result.errors.length, 0, 'Must not contain any errors')
  })
}

exports['test async with fast fail'] = function (assert) {
  run({
    mute: true,
    'test:must throw': function ($, done) {
      throw new Error('Boom!!')
    }
  }, function (result) {
    assert.equal(result.passes.length, 0, 'Must not pass any test')
    assert.equal(result.fails.length, 0, 'Must not fail any test')
    assert.equal(result.errors.length, 1, 'Must contain one error')
  })
}

if (module == require.main) run(exports)

})
