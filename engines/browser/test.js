/* vim:set ts=2 sw=2 sts=2 expandtab */
/*jshint asi: true newcap: true undef: true es5: true node: true devel: true
         forin: false */
/*global define: true */

(function(define){
define(["exports", "./logger", "../../test", "../../assert"], function(exports, logger, test, assert, undefined){


var Logger = logger.Logger;

exports.Assert = assert.Assert
exports.run = function run(units, logger) {
  test.run(units, logger || new Logger())
}

});
})(typeof define != "undefined" ?
    define: // AMD/RequireJS format if available
    function(deps, factory){
        // CommonJS environment, like NodeJS
        deps = [exports].concat(deps.slice(1).map(function(name){
            return require(name);
        }));
        factory.apply(this, deps);
    }
);
