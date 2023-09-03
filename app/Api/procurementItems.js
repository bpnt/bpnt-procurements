var express = require('express')
var router = express.Router()

var ProcurementItemApi = require('../ModelApi/ProcurementItem')

/**
 * @name POST:/api/procurementItem
 *
 * @description index url
 */
router.post('/', async function (req, res, next) {

	var procurementItems = await ProcurementItemApi.findPublished()

	res.send({
		title: 'Procurement Item | Edtyro',
		message: 'Welcome to Edtyro API',
		payload: {
			procurementItems: procurementItems
		}
	})

})

module.exports = router
