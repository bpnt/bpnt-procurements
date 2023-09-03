'use strict'

/**
 * @file Uploader
 *
 * @description Uploader for file uploads
 *
 * @author Jeevan Prakash Pant <jp@edtyro.com>
 * @version 1.0.0
 * @copyright Edtyro Private limited, 2020
 */

var multer = require('multer')
var fs = require('fs')


/**
 * Uploader
 *
 * @param {Object} param - Size fo desired reference
 * @param {String} param.dir - dir to be used for uploads (e.g. blogs)
 * @param {Number} param.mimeTypes - Length of reference
 * @param {Number} param.limit - file size limit (in MB)
 *
 * @returns {Object} - upload parameters
 */
module.exports = (param) => {

	var dir = param.dir

	// create dir if not exists
	if (!fs.existsSync(dir)) {

		fs.mkdirSync(dir, { recursive: true }, err => {

			console.log(err)

		})

	}

	// Setting up Multer
	const storage = multer.diskStorage({
		destination: function (req, file, cb) {

			cb(null, dir)

		}
	})

	// file filter
	const fileFilter = (req, file, cb) => {


		// check fi file mimetype is contained in allowed mimeTypes
		if (param.mimeTypes.includes(file.mimetype)) {

			cb(null, true)

		} else {

			cb(null, false)

		}

	}

	return multer({
		storage: storage,
		limits: {
			fileSize: 1024 * 1024 * param.limit
		},
		fileFilter: fileFilter
	})

}
