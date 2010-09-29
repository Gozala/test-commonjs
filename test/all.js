'use strict'

exports['test fail fast'] = require('./fail-fast')
exports['test assertions'] = require('./assert')

if (module == require.main) require('test').run(exports)
