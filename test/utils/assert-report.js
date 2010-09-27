'use strict'

var AssertBase = require('test/assert')
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
        this.passes(message)
      }}
    , fail: { value: function fail(e) {
        this.fails.push(e)
      }}
    , error: { value: function error(e) {
        this.errors.push(e)
      }}
    }

function Assert() {
  return Object.create(AssertBase, AssertDescriptor)
}

