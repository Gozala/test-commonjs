/* vim:set ts=2 sw=2 sts=2 expandtab */
/*jshint asi: true newcap: true undef: true es5: true node: true devel: true
         forin: true */
/*global define: true */

(typeof define === "undefined" ? function ($) { $(require, exports, module) } : define)(function (require, exports, module, undefined) {

'use strict';

var run = require('../test').run
var Reporter = require('./utils/assert-report').Assert

exports['test must call callback to complete it'] = function (assert, done) {

    var isDone, isTimerCalled, report, completeInnerTest

    isDone = isTimerCalled = false
    report = null

    run({
      mute: true,
      Assert: Reporter,
      'test:must throw': function ($assert, $done) {
        report = $assert.report
        completeInnerTest = $done
        $assert.equal(1, 1, 'Must be equal')
      }
    }, function (result) {
      isDone = true
      assert.equal(isTimerCalled, true, 'timer should be called already')
      done()
    })

    setTimeout(function () {
      assert.equal(isDone, false, 'callback must not be called')
      assert.equal(report.passes.length, 1, 'Must contain one pass')
      isTimerCalled = true
      completeInnerTest()
    }, 0)
    }
    
    
    
exports['test multiple tests with timeout'] = function (assert, done) {
  var reports

  reports = []
  run({
    mute: true,
    'test async': function ($, done) {
      reports.push(1)
      setTimeout(function () {
        $.ok(true)
        $.ok(false)
        done()
      }, 100)
    },
    'test throws': function ($) {
      reports.push(2)
      throw new Error('boom')
    },
    'test fail fast': function ($) {
      reports.push(3)
      require('assert').ok(0)
    },
    'ignore if does not starts with test': function () {
      reports.push(5)
    },
    'test sync pass': function ($) {
      reports.push(4)
      $.equal(1, 2)
      $.equal(2, 2)
    }
  }, function (result) {
    assert.equal(reports.length, 4, 'Suite had to contain three tests')
    assert.equal(result.passes.length, 2, 'Must pass two tests')
    assert.equal(result.fails.length, 3, 'Must fail tree tests')
    assert.equal(result.errors.length, 1, 'Must report one error')
    done()
  })
}

if (module == require.main) run(exports)

})
