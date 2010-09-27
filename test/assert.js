'use strict'

var run = require('test').run
  , Reporter = require('./utils/assert-report').Assert

exports['test existence of all assert methods on `assert`'] = function(assert) {
  var functionType = 'function'
    , methods =
        [ 'ok', 'equal', 'notEqual', 'deepEqual', 'notDeepEqual', 'raises' ]
  run(
    { Assert: Reporter
    , mute: true
    , 'test fixture': function($) {
        methods.forEach(function(name) {
          assert.equal
          ( typeof $[name]
          , functionType
          , '`' + name + '` must be method of `assert`'
          )
        })
      }
    }
  )
}

exports['test correctness of `assert.ok`'] = function(assert) {
  var truthy = [ 1, -9, true, ',.', {}, function(){}, ['1'], Infinity ]
    , falsy = [ null, undefined, false, '', 0, NaN ]
    , report = null

  run(
    { Assert: Reporter
    , mute: true
    , 'test fixture': function($) {
        report = $.report
        truthy.forEach(function(value, index) {
          $.ok(value, value + ' is truthy')
          assert.equal
          ( report.passes.length
          , index + 1
          , 'The `' + value + '` must be truthy'
          )
        })

        falsy.forEach(function(value, index) {
          $.ok(value, value + ' is falsy')
          assert.equal
          ( report.fails.length
          , index + 1
          , 'The `' + value + '` must be falsy'
          )
        })

        assert.equal
        ( report.passes.length
        , truthy.length
        , 'All truthy properties must pass `ok` asserts'
        )

        assert.equal
        ( report.fails.length
        , falsy.length
        , 'All falsy values must fail `ok` asserts'
        )
      }
    }
  )
}



run(exports)

