'use strict'

/**
 * @file ReferenceGenerator
 *
 * @description AlphaNumeric Reference key generator
 *
 * @author Jeevan Prakash Pant <jp@edtyro.com>
 * @version 1.0.0
 * @copyright Edtyro Private limited, 2020
 */

/**
 * Reference Generator
 *
 * @param {Object} param - Size fo desired reference
 * @param {String} param.model - Model's model whose reference needs to be generated
 * @param {Number} param.length - Length of reference
 *
 * @returns {String} - Alphanumeric String
 */
module.exports = async (param) => {

	// Primitive Declaration
	var preReference = _generateReference(param.length)
	var found = false

	// reference validation
	var item = await param.model.findOne({ reference: preReference })

	if (item) {

		while (!found) {

			var reference = _generateReference(param.length)

			item = await param.model.findOne({ reference: reference })

			if (!item) {

				found = true

			}

		}

		return reference

	} else {

		return preReference

	}

}

/**
 * @private Reference Generator
 *
 * @param {Number} - Size fo desired reference
 *
 * @returns {String} - Alphanumeric String
 */
function _generateReference (length) {

	var mask = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
	var result = ''

	for (var i = length; i > 0; --i) result += mask[Math.floor(Math.random() * mask.length)]

	return result

}
