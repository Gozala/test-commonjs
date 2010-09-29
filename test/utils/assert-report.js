'use strict'

var AssertBase = require('test/assert').Assert
  , AssertDescriptor =
    { constructor: { value: Assert }
    , report: { get: function report() {
        Object.defineProperty(this, 'report', { value:
        { passes: []
        , fails: []
        , errors: []
        }})
        return this.report
      }, configurable: true }
    , pass: { value: function pass(message) {
        this.report.passes.push(message)
        Object.getPrototypeOf(this).pass.call(this, message)
      }}
    , fail: { value: function fail(e) {
        this.report.fails.push(e)
        Object.getPrototypeOf(this).fail.call(this, e)
      }}
    , error: { value: function error(e) {
        this.report.errors.push(e)
        Object.getPrototypeOf(this).error.call(this, e)
      }}
    }

function Assert() {
  return Object.create(AssertBase.apply(null, arguments), AssertDescriptor)
}
exports.Assert = Assert

