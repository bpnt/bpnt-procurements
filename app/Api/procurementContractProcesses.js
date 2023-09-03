var express = require('express')
var router = express.Router()

var ProcurementContractProcessApi = require('../ModelApi/ProcurementContractProcess')

/**
 * @name POST:/api/procurementContractProcesses
 *
 * @description index url
 */
router.post('/', async function (req, res, next) {

	var procurementContractProcesses = await ProcurementContractProcessApi.findPublished()

	res.send({
		title: 'Procurement Contract Process | Edtyro',
		message: 'Welcome to Edtyro API',
		payload: {
			procurementContractProcesses: procurementContractProcesses
		}
	})

})

module.exports = router
