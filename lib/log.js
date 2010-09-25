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

  , INDENT = '    '

function Color(color, message) {
  return color ? color + message + COLOR_RESET : message
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
    process.stdout.write(this.indent + message.replace(/\n/g, this.indent + '\n') + '\n')
  }
, pass: function pass(message) {
    this.print(INDENT + Color(COLOR_PASS, ICON_PASS + message))
  }
, fail: function fail(e) {
    this.print(INDENT + Color(COLOR_FAIL, ICON_FAIL + e.message))
    if ('operator' in e) {
      this.print(INDENT + Color(COLOR_FAIL, 'Expected: ' + e.expected))
      this.print(INDENT + Color(COLOR_FAIL, 'Actual: ' + e.actual))
      this.print(INDENT + Color(COLOR_FAIL, 'Operator: ' + e.operator))
    }
  }
, error: function error(e) {
    this.print(INDENT + Color(COLOR_ERROR, ICON_ERROR + e.message))
    if ('stack' in e) this.print(Color(COLOR_ERROR, e.stack))
  }
, section: function section(options) {
    options = options || {}
    options.indent = this.indent + INDENT
    return Log(options)
  }
}
exports.Log = Log

