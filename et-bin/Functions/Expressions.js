'use strict'

/**
 * @file Expressions
 *
 * @description Expressions for string options
 *
 * @author Jeevan Prakash Pant <jp@edtyro.com>
 * @version 1.0.0
 * @copyright Edtyro Private limited, 2020
 */

/**
 * @module escapeRegex
 *
 * @description escape regular expressions
 *
 * @param {String} text text
 */
const escapeRegex = (text) => {

	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')

}

module.exports = {
	escapeRegex
}
