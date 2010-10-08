CommonJS Test Runner
====================

Implementation of test runner compatible with [CommonJS Unit Testing/1.1]

Testing
-------

In order to make your package testable from [npm] you should:

- Create a directory in your package root.
- Define test directory in package descriptor under `directories` section.
- Define test script in package descriptor under `scripts` section.
- Define dependency on this package (It's name is "test" in [npm] registry).
- Write your tests
- Test your package by running all tests `npm test mypackage@active`
  or run individual tests `node path/to/test/group.js`

####Example####

<script src="http://gist.github.com/616484.js"> </script>


For more examples checkout tests for this package and for more details see
the [CommonJS Unit Testing/1.1] specification.

[CommonJS Unit Testing/1.1]:http://wiki.commonjs.org/wiki/Unit_Testing/1.1
[npm]:http://npmjs.org/

