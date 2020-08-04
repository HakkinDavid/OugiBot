/*!
 * is-hexcolor <https://github.com/tunnckoCore/is-hexcolor>
 *
 * Copyright (c) 2015 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

/* jshint asi:true */

'use strict'

var test = require('assertit')
var isHexcolor = require('./index')

test('is-hexcolor:', function () {
  test('should return true on six digit hex value', function () {
    var actual = isHexcolor('#ffffff')
    var expected = true

    test.equal(actual, expected)
  })
  test('should return true on three digit hex value', function () {
    var actual = isHexcolor('#fff')
    var expected = true

    test.equal(actual, expected)
  })
  test('should return false on invalid hex value', function () {
    test('on `#9gg` value', function () {
      var actual = isHexcolor('#9gg')
      var expected = false

      test.equal(actual, expected)
    })
    test('on `#abcZZZ` value', function () {
      var actual = isHexcolor('#abcZZZ')
      var expected = false

      test.equal(actual, expected)
    })
    test('on `#3333` value', function () {
      var actual = isHexcolor('#3333')
      var expected = false

      test.equal(actual, expected)
    })
    test('on `#44445555` value', function () {
      var actual = isHexcolor('#44445555')
      var expected = false

      test.equal(actual, expected)
    })
  })
  test('should return false on non hex value', function () {
    test('on `fff` value', function () {
      var actual = isHexcolor('fff')
      var expected = false

      test.equal(actual, expected)
    })
    test('on `foo bar` value', function () {
      var actual = isHexcolor('foo bar')
      var expected = false

      test.equal(actual, expected)
    })
    test('on `foo #fff bar` value', function () {
      var actual = isHexcolor('foo #fff bar')
      var expected = false

      test.equal(actual, expected)
    })
    test('on `foo #f3f3f3 bar` value', function () {
      var actual = isHexcolor('foo #f3f3f3 bar')
      var expected = false

      test.equal(actual, expected)
    })
  })
})
