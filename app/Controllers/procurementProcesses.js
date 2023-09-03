var express = require('express')
var router = express.Router()

/* imports */
var csrf = require('csurf')
var bodyParser = require('body-parser')

// pre work for csrf
var csrfProtection = csrf({ cookie: true })
var parseForm = bodyParser.urlencoded({ extended: false })

var ProcurementProcess = require('../Model/ProcurementProcess')
var ProcurementItem = require('../Model/ProcurementItem')
var Supplier = require('../Model/Supplier')

/* Library declarations */
var access = require(require('../../config/paths').functions).access
var expressions = require(require('../../config/paths').functions).expressions
var redirectTo = require(require('../../config/paths').functions).redirectTo

/* Paths */
var mainUrl = require('../../config/app').mainUrl
var view = require('../../config/app').view + 'modules/procurementProcesses/'

/**
 * @name GET:/procurementProcesses
 *
 * @description index url
 */
router.get('/', access('procurementProcesses:index'), async function (req, res, next) {

	// declarations
	var perPage = 10
	var pageNo = req.query.page ? req.query.page : 1
	var totalCount = await ProcurementProcess.countDocuments({})
	var pages = Math.ceil(totalCount / perPage)

	if (pageNo <= 0) {

		redirectTo(req, res, {
			url: mainUrl + 'procurement-processes'
		})

	}

	var items = []
	var totalCount = 0
	var searchUrl = ''

	if (req.query.search) {

		const regex = new RegExp(expressions.escapeRegex(req.query.search), 'gi')

		totalCount = await ProcurementProcess.countDocuments({
			$or: [
				{ category: regex },
				{ name: regex }
			]
		})

		if (totalCount < 1) {

			return res.send('No category match that query, please try again.')

		} else {

			items = await ProcurementProcess.find({
				$or: [
					{ category: regex },
					{ name: regex }
				]
			})
				.limit(perPage)
				.skip(perPage * (pageNo - 1))
				.sort({
					createdAt: 'desc'
				}).select({
					__v: 0,
					_id: 0,
					createdAt: 0,
					updatedAt: 0
				})

		}

		searchUrl = req.query.search

	} else {

		// total count of news
		totalCount = await ProcurementProcess.countDocuments({})

		items = await ProcurementProcess.find()
			.limit(perPage)
			.skip(perPage * (pageNo - 1))
			.sort({
				createdAt: 'desc'
			}).select({
				__v: 0,
				_id: 0,
				createdAt: 0,
				updatedAt: 0
			})

	}

	res.render(view + 'index', {
		title: 'Procurement Process | Edtyro',
		items: items,
		pageNo: pageNo,
		totalCount: totalCount,
		pages: pages,
		searchUrl: searchUrl
	})

})

/**
 * @name GET:/procurementProcesses/add
 *
 * @description add procurementProcesses
 */
router.get('/add', csrfProtection, access('procurementProcesses:add'), async function (req, res, next) {

    var procurementItems = await ProcurementItem.find()
    var suppliers = await Supplier.find()

	res.render(view + 'add', {
		csrfToken: req.csrfToken(),
		title: 'Add Procurement Process | Edtyro',
        procurementItems: procurementItems,
        suppliers: suppliers
	})

})

/**
 * @name POST:/procurementProcesses/add
 *
 * @description add procurementProcesses
 */
router.post('/add', parseForm, csrfProtection, access('procurementProcesses:add'), async function (req, res, next) {

	/* declarations */
	var publish = (req.body.publish === 'on')
	var publishApi = (req.body.publishApi === 'on')

	try {

		var save = await ProcurementProcess.saveBasic({
			name: req.body.name,
		}, {
			publish: publish,
			publishApi: publishApi
		})

		if (save) {

			req.flash({
				type: 'success',
				msg: 'Data saved successfully.'
			})

			redirectTo(req, res, {
				url: mainUrl + 'procurement-processes/'
			})

		} else {

			req.flash({
				type: 'failure',
				msg: 'ERROR : LA001 - Data couldn\'d be saved.'
			})

			redirectTo(req, res, {
				url: mainUrl + 'procurement-processes/add'
			})

		}

	} catch (error) {

		console.log(error)

		req.flash({
			type: 'failure',
			msg: 'ERROR : LA002 - Data couldn\'d be saved.'
		})

		redirectTo(req, res, {
			url: mainUrl + 'procurement-processes/add'
		})

	}

})

/**
 * @name GET:/procurementProcesses/view
 *
 * @description edit news
 */
router.get('/view/:reference', csrfProtection, access('procurementProcesses:view'), async function (req, res, next) {

	try {

		var data = await ProcurementProcess.findOne({
			reference: req.params.reference
		}).populate({
			path: 'procurementItemId',
			select: ['_id', 'name'],
			model: ProcurementItem
		}).populate({
			path: 'supplierId',
			select: ['_id', 'name'],
			model: Supplier
		})

		if (data.drop === true) {

			req.flash({
				type: 'warning',
				msg: 'Restore Data to view!'
			})

			redirectTo(req, res, {
				url: mainUrl + 'procurement-processes/',
				reference: req.params.reference
			})

		}

		res.render(view + 'view', {
			item: data,
			csrfToken: req.csrfToken(),
			title: 'View Procurement Process | Edtyro'
		})

	} catch (error) {

		// console.log(error)

		req.flash({
			type: 'failure',
			msg: 'ERROR : CE001 - Something went wrong!'
		})

		redirectTo(req, res, {
			url: mainUrl + 'procurement-processes',
			reference: req.params.reference
		})

	}

})

/**
 * @name GET:/procurementProcesses/edit
 *
 * @description edit procurementProcesses
 */
router.get('/edit/:reference', csrfProtection, access('procurementProcesses:edit'), async function (req, res, next) {

	try {

		var data = await ProcurementProcess.findOne({
			reference: req.params.reference
		}).populate({
			path: 'procurementItemId',
			select: ['_id', 'name'],
			model: ProcurementItem
		}).populate({
			path: 'supplierId',
			select: ['_id', 'name'],
			model: Supplier
		})

		var procurementItems = await ProcurementItem.find()
		var suppliers = await Supplier.find()

		if (data.drop === true) {

			req.flash({
				type: 'warning',
				msg: 'Restore Data to make any Update!'
			})

			redirectTo(req, res, {
				url: mainUrl + 'procurement-processes/',
				reference: req.params.reference
			})

		}

		res.render(view + 'edit', {
			item: data,
			procurementItems: procurementItems,
			suppliers: suppliers,
			csrfToken: req.csrfToken(),
			title: 'Edit Procurement Process | Edtyro'
		})

	} catch (error) {

		// console.log(error)

		req.flash({
			type: 'failure',
			msg: 'ERROR : AE001 - Something went wrong!'
		})

		redirectTo(req, res, {
			url: mainUrl + 'procurement-processes',
			reference: req.params.reference
		})

	}

})

/**
 * @name POST:/procurementProcesses/edit
 *
 * @description edit applications
 */
router.post('/edit/:reference', csrfProtection, access('procurementProcesses:edit'), async function (req, res, next) {

	// declarations
	var redirection = mainUrl + 'procurement-processes/edit/' + req.params.reference
	var msgType = 'default'
	var msgText = '.'

	if (req.body._page === 'general-details') {

		/* declarations */
		var publish = (req.body.publish === 'on')
		var publishApi = (req.body.publishApi === 'on')

		try {

			var update = await ProcurementProcess.updateCustom(req.params.reference, {
				name: req.body.name,
				publish: publish,
				publishApi: publishApi

			})

			// message text
			if (update.nModified > 0) {

				msgType = 'success'
				msgText = 'Basic Details updated.'

			} else {

				msgType = 'failure'
				msgText = 'ERROR : APE001 - Data couldn\'t be updated.'

			}

		} catch (error) {

			console.log(error)

			msgType = 'failure'
			msgText = 'ERROR : ADE002 - Data couldn\'t be updated.'

		}

	} else if (req.body._page === 'pis') {

		var procurementItemId = []

		// concerned products
		if (Array.isArray(req.body.procurementItemId)) {

			procurementItemId = req.body.procurementItemId

		} else {

			procurementItemId.push(req.body.procurementItemId)

		}

		try {

			update = await ProcurementProcess.updateCustom(req.params.reference, {
				procurementItemId: procurementItemId
			})

			// message text
			if (update.nModified > 0) {

				msgType = 'success'
				msgText = 'Concerned Products updated.'

			} else {

				msgType = 'danger'
				msgText = 'ERROR : VE004 - Data couldn\'t be updated.'

			}

		} catch (error) {

			// console.log(error)

			msgType = 'danger'
			msgText = 'ERROR : PD004 - Data couldn\'t be updated.'

		}

	} else if (req.body._page === 'suppliers') {

		var supplierId = []

		// concerned products
		if (Array.isArray(req.body.supplierId)) {

			supplierId = req.body.supplierId

		} else {

			supplierId.push(req.body.supplierId)

		}

		try {

			update = await ProcurementProcess.updateCustom(req.params.reference, {
				supplierId: supplierId
			})

			// message text
			if (update.nModified > 0) {

				msgType = 'success'
				msgText = 'Concerned Products updated.'

			} else {

				msgType = 'danger'
				msgText = 'ERROR : VE004 - Data couldn\'t be updated.'

			}

		} catch (error) {

			// console.log(error)

			msgType = 'danger'
			msgText = 'ERROR : PD004 - Data couldn\'t be updated.'

		}
	} else if (req.body._page === 'authorizations') {

		var authorizations = []

		// steps
		if (Array.isArray(req.body.authorizedBy)) {

			var o = req.body.authorizedBy
			var d = req.body.authorizedAt
			var s = req.body.remarks

			for (var i = 0; i < s.length; i++) {

				authorizations.push({
					authorizedBy: o[i],
					authorizedAt: d[i],
					remarks: s[i]
				})

			}

		} else {

			authorizations.push({
				authorizedBy: req.body.authorizedBy,
				authorizedAt: req.body.authorizedAt,
				remarks: req.body.remarks
			})

		}

		try {

			update = await ProcurementProcess.updateCustom(req.params.reference, {
				authorizations: authorizations
			})

			// message text
			if (update.nModified > 0) {

				msgType = 'success'
				msgText = 'Authorizations updated.'

			} else {

				msgType = 'failure'
				msgText = 'ERROR : NE002 - Data couldn\'t be updated.'

			}

		} catch (error) {

			// console.log(error)

			msgType = 'failure'
			msgText = 'ERROR : APE004 - Data couldn\'t be updated.'

		}

		redirection = redirection + '#authorizations+'

	} else if (req.body._page === 'approvals') {

		var approvals = []

		// steps
		if (Array.isArray(req.body.approvedBy)) {

			var a = req.body.approvedBy
			var b = req.body.approvedAt
			var c = req.body.remarks

			for (var i = 0; i < a.length; i++) {

				approvals.push({
					approvedBy: a[i],
					approvedAt: b[i],
					remarks: c[i]
				})

			}

		} else {

			approvals.push({
				approvedBy: req.body.approvedBy,
				approvedAt: req.body.approvedAt,
				remarks: req.body.remarks
			})

		}

		try {

			update = await ProcurementProcess.updateCustom(req.params.reference, {
				approvals: approvals
			})

			// message text
			if (update.nModified > 0) {

				msgType = 'success'
				msgText = 'Approvals updated.'

			} else {

				msgType = 'failure'
				msgText = 'ERROR : NE002 - Data couldn\'t be updated.'

			}

		} catch (error) {

			// console.log(error)

			msgType = 'failure'
			msgText = 'ERROR : APE004 - Data couldn\'t be updated.'

		}

		redirection = redirection + '#approvals+'

	} else if (req.body._page === 'ssjForms') {

		var ssjForms = []

		// steps
		if (Array.isArray(req.body.authorizedBy)) {

			var o = req.body.authorizedBy
			var d = req.body.date
			var s = req.body.reason

			for (var i = 0; i < s.length; i++) {

				ssjForms.push({
					authorizedBy: o[i],
					date: d[i],
					reason: s[i]
				})

			}

		} else {

			ssjForms.push({
				authorizedBy: req.body.authorizedBy,
				date: req.body.date,
				reason: req.body.reason
			})

		}

		try {

			update = await ProcurementProcess.updateCustom(req.params.reference, {
				ssjForms: ssjForms
			})

			// message text
			if (update.nModified > 0) {

				msgType = 'success'
				msgText = 'SSJ Forms updated.'

			} else {

				msgType = 'failure'
				msgText = 'ERROR : NE002 - Data couldn\'t be updated.'

			}

		} catch (error) {

			// console.log(error)

			msgType = 'failure'
			msgText = 'ERROR : APE004 - Data couldn\'t be updated.'

		}

		redirection = redirection + '#ssjForms+'

	} else if (req.body._page === 'payments') {

		var payments = []

		// steps
		if (Array.isArray(req.body.approvedBy)) {

			var o = req.body.approvedBy
			var d = req.body.paymentdate
			var s = req.body.assignedBy

			for (var i = 0; i < s.length; i++) {

				payments.push({
					approvedBy: o[i],
					paymentdate: d[i],
					assignedBy: s[i]
				})

			}

		} else {

			payments.push({
				approvedBy: req.body.approvedBy,
				paymentdate: req.body.paymentdate,
				assignedBy: req.body.assignedBy
			})

		}

		try {

			update = await ProcurementProcess.updateCustom(req.params.reference, {
				payments: payments
			})

			// message text
			if (update.nModified > 0) {

				msgType = 'success'
				msgText = 'Payments updated.'

			} else {

				msgType = 'failure'
				msgText = 'ERROR : NE002 - Data couldn\'t be updated.'

			}

		} catch (error) {

			// console.log(error)

			msgType = 'failure'
			msgText = 'ERROR : APE004 - Data couldn\'t be updated.'

		}

		redirection = redirection + '#payments+'

	}

	req.flash({
		type: msgType,
		msg: msgText
	})

	redirectTo(req, res, {
        url: redirection,
        reference: req.params.reference
	})

})

/**
 * @name GET:/procurementProcesses/delete/reference
 *
 * @description delete procurementProcesses
 */
router.get('/delete/:reference', access('procurementProcesses:delete'), async function (req, res, next) {

	try {

		await ProcurementProcess.delete(req.params.reference)
		req.flash({
			type: 'default',
			msg: 'Entry ' + req.params.reference + ' deleted successfully!! <a href="' + mainUrl + 'procurement-processes/' + req.params.reference + '">UNDO</a>'
		})

		redirectTo(req, res, {
			url: mainUrl + 'procurement-processes/'
		})

	} catch (error) {

		// console.log(error)
		req.flash({
			type: 'danger',
			msg: 'ERROR : QTD001 - Entry couldn\'t be deleted.'
		})

		redirectTo(req, res, {
			url: mainUrl + 'procurement-processes/',
			reference: req.params.reference
		})

	}

})

/**
	* @name GET:/procurementProcesses/restore/reference
	*
	* @description restore procurementProcesses
	*/
router.get('/restore/:reference', access('procurementProcesses:purge'), async function (req, res, next) {

	try {

		await ProcurementProcess.restore(req.params.reference)
		req.flash({
			type: 'info',
			msg: 'Entry restored successfully!!'
		})

		redirectTo(req, res, {
			url: mainUrl + 'procurement-processes/',
			reference: req.params.reference
		})

	} catch (error) {

		// console.log(error)
		req.flash({
			type: 'failure',
			msg: 'ERROR : QTD001 - Entry couldn\'t be restored.'
		})

		redirectTo(req, res, {
			url: mainUrl + 'procurement-processes/',
			reference: req.params.reference
		})

	}

})

/**
	* @name GET:/procurementProcesses/purge/reference
	*
	* @description purge procurementProcesses
	*/
router.get('/purge/:reference', access('procurementProcesses:purge'), async function (req, res, next) {

	try {

		await ProcurementProcess.purge(req.params.reference)

		req.flash({
			type: 'success',
			msg: 'Entry purged successfully!!'
		})

		redirectTo(req, res, {
			url: mainUrl + 'procurement-processes/'
		})

	} catch (error) {

		// console.log(error)
		req.flash({
			type: 'failure',
			msg: 'ERROR : QTP001 - Entry couldn\'t be purged.'
		})

		redirectTo(req, res, {
			url: mainUrl + 'procurement-processes/',
			reference: req.params.reference
		})

	}

})

module.exports = router
