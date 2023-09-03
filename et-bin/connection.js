'use strict'

/**
 * @file connection
 *
 * @description Database connection
 *
 * @author Jeevan Prakash Pant <jp@edtyro.com>
 * @version 1.0.0
 * @copyright Edtyro Private limited, 2020
 */

const mongoose = require('mongoose')
const config = require('../config/db')

mongoose.Promise = global.Promise

/**
 * createConnection
 *
 * @param {String } - connection from config
 *
 * @returns { String } - slugified string
 */
function createConnection (name) {

	if (typeof name !== 'undefined' && name) {

		return mongoose.createConnection(config[name], {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true
		})

	} else {

		return mongoose.createConnection(config.default, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true
		})

	}

}

module.exports.on = createConnection
