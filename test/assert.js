'use strict'

var run = require('test').run
  , Reporter = require('./utils/assert-report').Assert

exports['test:pass'] = function(assert) {
  var functionType = 'function'
  run(
    { Assert: Reporter
    , 'test:existence of assert methods': function($) {
        assert.equal
        ( typeof $.ok
        , functionType
        , '`assert` must contain `ok` assertion function.'
        )
      }
    }
  )
}

run(exports)

