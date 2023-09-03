var express = require('express')
var router = express.Router()

var ProcurementProcessesApi = require('../ModelApi/ProcurementProcess')

/**
 * @name POST:/api/procurementProcess
 *
 * @description index url
 */
router.post('/', async function (req, res, next) {

	var procurementProcesses = await ProcurementProcessesApi.findPublished()

	res.send({
		title: 'Procurement Process | Edtyro',
		message: 'Welcome to Edtyro API',
		payload: {
			procurementProcesses: procurementProcesses
		}
	})

})

module.exports = router
