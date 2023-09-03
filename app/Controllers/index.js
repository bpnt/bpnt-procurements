var express = require('express')
var router = express.Router()

/* declarations */
var access = require(require('../../config/paths').functions).access
var view = require('../../config/app').view + 'modules/'

/**
 * @name GET:/
 *
 * @description index url
 */
router.get('/', access('app:index'), async function (req, res, next) {

	res.render(view + 'app', { title: 'Application | Edtyro' })

})

module.exports = router
