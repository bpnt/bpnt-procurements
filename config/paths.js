'use strict'

/**
 * @file paths
 *
 * @description paths config for mulitple options
 *
 * @author Jeevan Prakash Pant <jp@edtyro.com>
 * @version 1.0.0
 * @copyright Edtyro Private limited, 2020
 */

const path = require('path')

module.exports = {
	connection: path.join(__dirname, '..', 'et-bin', 'connection.js'),
	functions: path.join(__dirname, '..', 'et-bin', 'Functions'),
	helpers: path.join(__dirname, '..', 'et-bin', 'Helpers')
}
