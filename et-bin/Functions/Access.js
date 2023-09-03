'use strict'

/**
 * @file Access
 *
 * @description lib Permission/Access
 *
 * @author Jeevan Prakash Pant <jp@edtyro.com> INITIAL
 * @version 1.0.0
 * @copyright Edtyro Private Limited, 2020
 */

const config = require('../../config/permission')

module.exports = (permission = 'none') => {

	return async (req, res, next) => {

		req.session.user = {
			username : 'Test User'
		}
		var pExists = false

		for (const [key, value] of Object.entries(config)) {

			for (const [sKey] of Object.entries(value)) {

				res.locals.hasPermission[`${key}:${sKey}`] = true

				if (permission !== 'none' && permission === `${key}:${sKey}`) {

					pExists = true

				}

			}

		}

		if (pExists === true) {

			next()

		} else {

			res.send('Permission not found!')

		}

	}

}
