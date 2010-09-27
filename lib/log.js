'use strict'

var COLOR_BLANK = '\033[0;30m'
  , COLOR_RED = '\033[0;31m'
  , COLOR_GREEN = '\033[0;32m'
  , COLOR_YELLOW = '\033[0;33m'
  , COLOR_BLUE = '\033[0;34m'
  , COLOR_PURPLE = '\033[0;35m'
  , COLOR_CYAN = '\033[0;36m'
  , COLOR_WHITE = '\033[0;37m'
  , COLOR_RESET = '\033[m'

  , COLOR_PASS = COLOR_GREEN
  , COLOR_FAIL = COLOR_RED
  , COLOR_ERROR = COLOR_PURPLE

  , ICON_PASS = '✓ '
  , ICON_FAIL = '✗ '
  , ICON_ERROR = '⚡ '
  , ICON_SECTION = '* '

  , INDENT = '    '

function Color(color, message) {
  return color ? color + message + COLOR_RESET : message
}
function Indent(message, indent) {
  indent = undefined == indent ? INDENT : indent
  return message.replace(/^/gm, indent)
}

function Log(options) {
  options = options || {}
  return Object.create(Log.prototype,
    { name: { value: options.name }
    , indent: { value: options.indent || Log.prototype.indent }
    }
  )
}
Log.prototype =
{ constructor: Log
, indent: ''
, print: function print(message) {
    process.stdout.write(Indent(message, this.indent) + '\n')
  }
, pass: function pass(message) {
    this.print(Indent(Color(COLOR_PASS, ICON_PASS + message)))
  }
, fail: function fail(e) {
    var message = e.message
    if ('operator' in e) {
      message += '\n' + INDENT
      message += ' Expected: `' + e.expected + '`'
      message += ' Actual: `' + e.actual + '`'
      message += ' Operator: `' + e.operator + '`'
    }
    this.print(Indent(Color(COLOR_FAIL, ICON_FAIL + message)))
  }
, error: function error(e) {
    this.print(Indent(Color(COLOR_ERROR, ICON_ERROR + e.stack)))
  }
, section: function section(options) {
    options = options || {}
    options.indent = this.indent + INDENT
    return Log(options)
  }
}
exports.Log = Log

