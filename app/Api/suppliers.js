var express = require('express')
var router = express.Router()

var SupplierApi = require('../ModelApi/Supplier')

/**
 * @name POST:/api/supplier
 *
 * @description index url
 */
router.post('/', async function (req, res, next) {

	var suppliers = await SupplierApi.findPublished()

	res.send({
		title: 'Supplier | Edtyro',
		message: 'Welcome to Edtyro API',
		payload: {
			suppliers: suppliers
		}
	})

})

module.exports = router
