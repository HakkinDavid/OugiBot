/*!
 * is-hexcolor <https://github.com/tunnckoCore/is-hexcolor>
 *
 * Copyright (c) 2015 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

'use strict'

var hexColorRegex = require('hex-color-regex');

module.exports = function isHexcolor (hex) {
  return hexColorRegex({strict: true}).test(hex)
}
