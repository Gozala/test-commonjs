'use strict'

var COLOR_BLANK = 'white'
  , COLOR_RED = 'red'
  , COLOR_GREEN = 'green'
  , COLOR_YELLOW = 'yellow'
  , COLOR_BLUE = 'blue'
  , COLOR_PURPLE = 'purple'
  , COLOR_CYAN = 'cyan'
  , COLOR_WHITE = 'white'
  , COLOR_RESET = ''

  , COLOR_PASS = COLOR_GREEN
  , COLOR_FAIL = COLOR_RED
  , COLOR_ERROR = COLOR_PURPLE

  , ICON_PASS = '✓ '
  , ICON_FAIL = '✗ '
  , ICON_ERROR = '⚡ '
  , ICON_SECTION = '* '

  , INDENT = '    '
  , output = null

function Output() {
  output = document.getElementById('test-output') || document.createElement('pre')
  document.body.appendChild(output)
  return output
}

function Color(color, message) {
  return '<span style="color: ' + (color || COLOR_BLANK) + ';">' + message + '</span>'
}
function Indent(message, indent) {
  indent = undefined == indent ? INDENT : indent
  return message.replace(/^/gm, indent)
}

/**
 * Internal utility function that is used to generate
 * textual representation of things passed to it.
 */
function toSource(thing, indent, visited) {
  indent = undefined !== indent ? indent + '  ' : ''
  var result, index, root
  if (!visited) {
    root = true
    visited = []
  }
  index = visited.indexOf(thing)
  if (0 <= index) return '#' + ++index + '#'
  switch(typeof(thing)) {
    case 'string':
      result = '"' + thing + '"'
      break
    case 'number':
      result = '' + thing
      break
    case 'object':
      if (null === thing) {
        result = 'null'
        break
      }
      if (Array.isArray(thing)) {
        result = '['
        result += thing.map(function($) { return toSource($, indent, visited) }).join(',')
        result += ']'
        break
      }
      visited.push(thing)
      var names = []
      for (var name in thing) names.push(name)
      result = thing + '' !== {} + '' ? '/* ' + thing + ' */' : ''
      if (names.length > 0) {
        result += '\n' + indent + '{ '
        result += names.map(function(name) {
          var repr = '\'' + name + '\': '
          try {
            repr += toSource(thing[name], indent, visited)
          } catch(e) {
            repr += '[Exception!]'
          }
          return repr
        }).join('\n' + indent + ', ')
        result += '\n' + indent + '}'
      }
      break
    case "function":
      result = thing.toString().split('\n').join('\n' + indent)
      break
    default:
      result = '' + thing
   }
   return root && '\n' === result.charAt(0) ? result.substr(1) : result
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
    var line = document.createElement('div')
    ;(output || Output()).appendChild(line)
    line.innerHTML = Indent(message, this.indent)
  }
, pass: function pass(message) {
    this.print(Indent(Color(COLOR_PASS, ICON_PASS + message)))
  }
, fail: function fail(e) {
    var message = e.message
    if ('expected' in e)
      message += '\n  Expected: \n' + toSource(e.expected, INDENT)
    if ('actual' in e)
      message += '\n  Actual: \n' + toSource(e.actual, INDENT)
    if ('operator' in e)
      message += '\n  Operator: ' + toSource(e.operator, INDENT)
    this.print(Indent(Color(COLOR_FAIL, ICON_FAIL + message)))
  }
, error: function error(e) {
    this.print(Indent(Color(COLOR_ERROR, ICON_ERROR + toSource(e))))
  }
, section: function section(options) {
    options = options || {}
    options.indent = this.indent + INDENT
    return Log(options)
  }
}
exports.Log = Log

