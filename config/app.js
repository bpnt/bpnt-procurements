'use strict'

/**
 * @file app
 *
 * @description app config for mulitple options
 *
 * @author Jeevan Prakash Pant <jp@edtyro.com>
 * @version 1.0.0
 * @copyright Edtyro Private limited, 2020
 */

const path = require('path')

module.exports = {
	view: path.join(__dirname, '..', 'views/'),
	mainUrl: '/',
	uploads: path.join(__dirname, '..', 'public', 'uploads')
}
