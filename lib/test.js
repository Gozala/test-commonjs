'use strict'

function _slice(target, from, to) {
  return Array.prototype.slice.call(target, from, to)
}
/**
 * Class representing test unit.
 */
function Test(name, test) {
  var self = Object.create(Test.prototype)
  self.name = name
  self.fails = []
  self.errors = []
  self.passes = []
  self.pass = self.pass.bind(self)
  self.fail = self.fail.bind(self)
  self.assert = self.assert.bind(self)
  self.run = self.run.bind(self, test)
  return self
}
Test.prototype = 
{ constructor: Test
, name: null
, suite: null
, completed: false
, fails: null
, errors: null
, passes: null
, pass: function pass(assert) {
    this.passes.push(assert)
  }
, fail: function fail(e) {
    if ('AssertionError' !== e.name) return this.error(e)
    this.fails.push(e)
  }
, error: function error(e) {
    this.errors.push(e)
    console.error(e.message, e.stack)
  }
, complete: function complete(callback) {
    if (!this.completed) {
      this.completed = true
      callback(this)
    }
    else this.fail(new Error('Completeing already completed test.'))
  }
, assert: function assert(assertion) {
    try {
      if (this.completed) 
        throw new Error('Assertion in already completetd test.')
      this.pass(assertion.apply(this.assert, _slice(arguments, 1)))
    } catch (e) {
      this.fail(e)
    }
  }
, run: function run(test, callback) {
    this.complete = Test.prototype.complete.bind(this, callback)
    // sync
    if (test.length <= 1) return this.complete(this.assert(test, this.assert))
    try { // async
      test(this.assert, this.complete)
    } catch(e) {
      this.complete(this.fail(e))
    }
  }
}
exports.Test = Test

/**
 *
 */
function Suite(name, tests) {
  var self = Object.create(Suite.prototype)
    , units = self.tests = []
  self.name = name || 'Tests'
  self.next = self.next.bind(self, { index: 0 })
  self.run = self.run.bind(self)
  for (var key in tests) {
    if (0 !== key.indexOf('test')) continue
    var test = tests[key]
    units.push(('function' == typeof test ? Test : Suite)(key, test))
  }
  return self
}
Suite.prototype = Object.create(
  { constructor: Suite
  , name: null
  , tests: null
  , complete: null
  , run: function run(callback) {
      this.complete = callback.bind(null, this)
      this.next()
    }
  , next: function next(iteration) {
      var tests = this.tests
      if (iteration.index < tests.length) 
        tests[iteration.index ++].run(this.next)
      else this.complete(iteration.index = 0)
    }
  }
, { passes: { get: UnitedProprerty('passes') }
  , fails: { get: UnitedProprerty('fails') }
  , errors: { get: UnitedProprerty('errors') }
  }
)
exports.Suite = Suite

function UnitedProprerty(name) {
  return function Property() {
    return this.tests.reduce(function(value, test) {
      return value.concat(test[name])
    }, [])
  }
}

function run(tests, callback) {
  Suite('Tests', tests).run(function(suite) {
    if (callback && false === callback(suite)) return
    console.log('Passed:', suite.passes.length)
    console.log('Failed:', suite.fails.length)
    console.log('Errors:', suite.errors.length)
  })
}
exports.run = run

