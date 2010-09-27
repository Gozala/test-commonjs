'use strict'

var Assert = require('./assert').Assert
  , Log = require('./log').Log
  // constancts
  , ERR_COMPLETED_ASSERT = 'Assert in completed test'
  , ERR_COMPLETED_COMPLETE = 'Attemt to complete test more then one times'

/**
 * Test constructor. Wrapper of the CommonJS test function.
 */
function Test(options) {
  var self = Object.create(Test.prototype,
  { name: { value: options.name }
  , unit: { value: options.unit }
  , log: { value: options.log }
  , passes: { value: [] }
  , fails: { value: [] }
  , errors: { value: [] }
  })
  self.assert = options.Assert(self)
  return self
}
Test.prototype =
{ constructor: Test
/**
 * Name of the test unit.
 * @param {String}
 */
, name: null
/**
 * Instance of Logger used to log results of the tests. All the nested tests
 * and suites will get sub-loggers of this one.
 * @type {Logger}
 */
, log: null
/**
 * CommonJS test function that is being wrapped by this object.
 * @type {Function}
 */
, unit: null
/**
 * Array of all the `AssertError`s for the this unit.
 * @type {AssertError[]}
 */
, fails: null
/**
 * Array of the exceptions that occured during execurtion of this unit.
 * @type {Error[]}
 */
, errors: null
/**
 * Array of the passed assertion messages.
 * @type {String[]}
 */
, passes: null
/**
 * Wheather or not test execution is finished. Used for logging errors for all
 * the asserts that are executed after test is finished.
 */
, completed: false
, pass: function pass(message) {
    if (this.completed) return this.error(new Error(ERR_COMPLETED_ASSERT))
    this.passes.push(message)
    this.log.pass(message)
  }
, fail: function fail(e) {
    if (this.completed) return this.error(new Error(ERR_COMPLETED_ASSERT))
    this.fails.push(e)
    this.log.fail(e)
  }
, error: function error(e) {
    this.errors.push(e)
    this.log.error(e)
  }
, complete: function complete(callback) {
    if (this.completed) return this.error(new Error(ERR_COMPLETED_COMPLETE))
    callback(this, this.completed = true)
  }
, run: function run(callback) {
    var unit = this.unit
      , sync = unit.length <= 1
      , assert = this.assert
      , complete = this.complete = this.complete.bind(this, callback)
    try {
      this.log.print(this.name)
      unit(assert, complete)
      if (sync) this.complete()
    } catch(e) {
      if ('AssertError' == e.name) assert.fail(e)
      else assert.error(e)
      this.complete()
    }
  }
}

/**
 * Test suite / group constructor. All the tests in the suite can be executed
 * by calling `run` method on returned instance.
 * @param {Object} options
 *    Options with keys:
 *    @param {Object} tests
 *      List of test functions / sublists of test functions.
 *    @param {Log} log
 *      Logger for this Suite. If this is sub-suite logger provided will be
 *      smart enough to indent results for this suite.
 *    @param {Assert} Assert
 *      Assertions constructor. Constructor is used to construct individual
 *      assert objects per test.
 */
function Suite(options) {
  var log = options.log
    , Assert = options.Assert
    , units = []
    , unitMap = options.units

  for (var name in unitMap) {
    if (0 !== name.indexOf('test')) continue
    var unit = unitMap[name]
    units.push(('function' == typeof unit ? Test : Suite)(
    { name: name
    , units: unit
    , unit: unit
    , Assert: Assert
    , log: log.section()
    }))
  }

  return Object.create(Suite.prototype,
  { name: { value: options.name }
  , log: { value: log }
  , Assert: { value: Assert }
  , units: { value: units }
  })
}
Suite.prototype = Object.create(
  { constructor: Suite
  /**
   * Name of the test unit.
   * @param {String}
   */
  , name: null
  /**
   * Instance of Logger used to log results of the tests. All the nested tests
   * and suites will get sub-loggers of this one.
   * @type {Logger}
   */
  , log: null
  /**
   * Array of all the `AssertError`s for the this unit.
   * @type {AssertError[]}
   */
  , fails: null
  /**
   * Array of the exceptions that occured during execurtion of this unit.
   * @type {Error[]}
   */
  , errors: null
  /**
   * Array of the passed assertion messages.
   * @type {String[]}
   */
  , passes: null
  /**
   * List of tests / suites to run on execution.
   * @type {Suite|Test[]}
   */
  , units: null
  /**
   * Index of the test that will be executed on calling `next`.
   * @type {Number}
   */
  , index: 0
  /**
   * Callback that is called when all the tests in the suite are executed.
   * @type {Function}
   */
  , complete: null
  /**
   * Calling this function executes all the tests in this and all the subsuites.
   * Passed callback is called after all tests are finished.
   * @param {Function} callback
   *    Function that will be called once whole suite is executed
   */
  , run: function run(callback) {
      this.log.print(this.name)
      this.complete = callback
      this.next = this.next.bind(this)
      this.next()
    }
  /**
   * Runs next test / suite of tests. If no tests are left in the suite
   * callback passed to the run method is called instead.
   */
  , next: function next() {
      var units = this.units
      if (this.index < units.length) {
        units[this.index ++].run(this.next)
      }
      else this.complete(this)
    }
  }
, { passes: { get: UnitedProprerty('passes') }
  , fails: { get: UnitedProprerty('fails') }
  , errors: { get: UnitedProprerty('errors') }
  }
)

function UnitedProprerty(name) {
  return function Property() {
    return this.units.reduce(function(value, unit) {
      return value.concat(unit[name])
    }, [])
  }
}

/**
 * Runs passed tests.
 */
function run(units, callback) {
  var log = Log()
  Suite(
    { name: 'Running all tests:'
    , units: units
    , log: log
    , Assert: units.Assert || Assert
    }
  ).run(function(suite) {
    if (callback) return callback(suite)
    log.print('Passed:' + suite.passes.length)
    log.print('Failed:' + suite.fails.length)
    log.print('Errors:' + suite.errors.length)
  })
}
exports.run = run

