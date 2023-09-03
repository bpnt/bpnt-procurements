var express = require('express')
var router = express.Router()

/**
 * @name GET:/api
 *
 * @description index url
 */
router.get('/', async function (req, res, next) {

	res.send({
		title: 'Application | Edtyro',
		message: 'Welcome to Edtyro API',
		apiList: {
		}
	})

})

module.exports = router
