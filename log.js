/* vim:set ts=2 sw=2 sts=2 expandtab */
/*jshint asi: true newcap: true undef: true es5: true node: true devel: true
         forin: false */
/*global define: true */


(typeof define === "undefined" ? function ($) { $(require, exports, module) } : define)(function (require, exports, module, undefined) {


var utils = require('./utils.js')

var COLOR_BLANK = '\033[0;30m',
    COLOR_RED = '\033[0;31m',
    COLOR_GREEN = '\033[0;32m',
    COLOR_YELLOW = '\033[0;33m',
    COLOR_BLUE = '\033[0;34m',
    COLOR_PURPLE = '\033[0;35m',
    COLOR_CYAN = '\033[0;36m',
    COLOR_WHITE = '\033[0;37m',
    COLOR_RESET = '\033[m',

    COLOR_PASS = COLOR_GREEN,
    COLOR_FAIL = COLOR_RED,
    COLOR_ERROR = COLOR_PURPLE,

    ICON_PASS = '✓ ',
    ICON_FAIL = '✗ ',
    ICON_ERROR = '⚡ ',
    ICON_SECTION = '* ',

    INDENT = '    '



function Color(color, message) {
  return color ? color + message + COLOR_RESET : message
}

function Indent(message, indent) {
  indent = undefined === indent ? INDENT : indent
  return message.replace(/^/gm, indent)
}

function Log(options) {
  options = options || {}
  return Object.create(Log.prototype, {
    name: {
      value: options.name
    },
    indent: {
      value: options.indent || Log.prototype.indent
    }
  })
}
Log.prototype = {
  constructor: Log,
  indent: '',
  print: function print(message) {
    process.stdout.write(Indent(message, this.indent) + '\n')
  },
  pass: function pass(message) {
    this.print(Indent(Color(COLOR_PASS, ICON_PASS + message)))
  },
  fail: function fail(e) {
    var message = e.message
    if ('expected' in e)
      message += '\n  Expected: \n' + Indent(utils.source(e.expected))
    if ('actual' in e)
      message += '\n  Actual: \n' + Indent(utils.source(e.actual))
    if ('operator' in e)
      message += '\n  Operator: ' + Indent(utils.source(e.operator))
    this.print(Indent(Color(COLOR_FAIL, ICON_FAIL + message)))
  },
  error: function error(e) {
    this.print(Indent(Color(COLOR_ERROR, ICON_ERROR + (e.stack || e))))
  },
  section: function section(options) {
    options = options || {}
    options.indent = this.indent + INDENT
    return Log(options)
  }
}
exports.Log = Log

});
