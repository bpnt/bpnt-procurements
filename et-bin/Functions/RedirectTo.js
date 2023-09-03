'use strict'

/**
 * @file RedirectTo
 *
 * @description lib Redirection
 *
 * @author Jeevan Prakash Pant <jp@edtyro.com>
 * @version 1.0.0
 * @copyright Edtyro Private Limited, 2020
 */

// const url = require('url')

/**
 * @module redirectTo
 *
 * @param {Object} req request Object
 * @param {Object} res response Object
 * @param {Object} robj redirection Object
 * @param {Object} robj.url redirection Url
 */
module.exports = (req, res, robj) => {

	res.redirect(robj.url)

}
