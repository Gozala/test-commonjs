'use strict'

exports['test fail fast'] = require('./fail-fast')
exports['test async'] = require('./async')
exports['test assertions'] = require('./assert')

if (module == require.main) require('test').run(exports)
