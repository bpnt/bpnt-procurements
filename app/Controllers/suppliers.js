var express = require('express')
var router = express.Router()

/* imports */
var csrf = require('csurf')
var bodyParser = require('body-parser')

// pre work for csrf
var csrfProtection = csrf({ cookie: true })
var parseForm = bodyParser.urlencoded({ extended: false })

var Supplier = require('../Model/Supplier')
var ProcurementItem = require('../Model/ProcurementItem')

/* Library declarations */
var access = require(require('../../config/paths').functions).access
var expressions = require(require('../../config/paths').functions).expressions
var redirectTo = require(require('../../config/paths').functions).redirectTo

/* Paths */
var mainUrl = require('../../config/app').mainUrl
var view = require('../../config/app').view + 'modules/suppliers/'

/**
 * @name GET:/suppliers
 *
 * @description index url
 */
router.get('/', access('suppliers:index'), async function (req, res, next) {

	// declarations
	var perPage = 10
	var pageNo = req.query.page ? req.query.page : 1
	var totalCount = await Supplier.countDocuments({})
	var pages = Math.ceil(totalCount / perPage)

	if (pageNo <= 0) {

		redirectTo(req, res, {
			url: mainUrl + 'suppliers'
		})

	}

	var items = []
	var totalCount = 0
	var searchUrl = ''

	if (req.query.search) {

		const regex = new RegExp(expressions.escapeRegex(req.query.search), 'gi')

		totalCount = await Supplier.countDocuments({
			$or: [
				{ category: regex },
				{ name: regex },
				{ email: regex }
			]
		})

		if (totalCount < 1) {

			return res.send('No category match that query, please try again.')

		} else {

			items = await Supplier.find({
				$or: [
					{ category: regex },
					{ name: regex },
					{ email: regex }
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
		totalCount = await Supplier.countDocuments({})

	items = await Supplier.find()
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
		title: 'Supplier | Edtyro',
		items: items,
		pageNo: pageNo,
		totalCount: totalCount,
		pages: pages,
		searchUrl: searchUrl
	})

})

/**
 * @name GET:/suppliers/add
 *
 * @description add suppliers
 */
router.get('/add', csrfProtection, access('suppliers:add'), async function (req, res, next) {

	var procurementItems = await ProcurementItem.find()

	res.render(view + 'add', {
		csrfToken: req.csrfToken(),
		title: 'Add Supplier | Edtyro',
		procurementItems: procurementItems
	})

})

/**
 * @name POST:/suppliers/add
 *
 * @description add suppliers
 */
router.post('/add', parseForm, csrfProtection, access('suppliers:add'), async function (req, res, next) {

	/* declarations */
	var publish = (req.body.publish === 'on')
	var publishApi = (req.body.publishApi === 'on')

	try {

		var save = await Supplier.saveBasic({
			name: req.body.name,
			email: req.body.email,
			phoneNo: req.body.phoneNo,
			state: req.body.state,
			pincode: req.body.pincode,
			approvedBy: req.body.approvedBy,
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
				url: mainUrl + 'suppliers/'
			})

		} else {

			req.flash({
				type: 'failure',
				msg: 'ERROR : LA001 - Data couldn\'d be saved.'
			})

			redirectTo(req, res, {
				url: mainUrl + 'suppliers/add'
			})

		}

	} catch (error) {

		console.log(error)

		req.flash({
			type: 'failure',
			msg: 'ERROR : LA002 - Data couldn\'d be saved.'
		})

		redirectTo(req, res, {
			url: mainUrl + 'suppliers/add'
		})

	}

})

/**
 * @name GET:/suppliers/view
 *
 * @description edit news
 */
router.get('/view/:reference', csrfProtection, access('suppliers:view'), async function (req, res, next) {

	try {

		var data = await Supplier.findByReference(req.params.reference)

		if (data.drop === true) {

			req.flash({
				type: 'warning',
				msg: 'Restore Data to view!'
			})

			redirectTo(req, res, {
				url: mainUrl + 'suppliers/',
				reference: req.params.reference
			})

		}

		res.render(view + 'view', {
			item: data,
			csrfToken: req.csrfToken(),
			title: 'View Supplier | Edtyro'
		})

	} catch (error) {

		// console.log(error)

		req.flash({
			type: 'failure',
			msg: 'ERROR : CE001 - Something went wrong!'
		})

		redirectTo(req, res, {
			url: mainUrl + 'suppliers',
			reference: req.params.reference
		})

	}

})

/**
 * @name GET:/suppliers/edit
 *
 * @description edit suppliers
 */
router.get('/edit/:reference', csrfProtection, access('suppliers:edit'), async function (req, res, next) {

	try {

		// populate concerned products id and name  from ProcurementItem for preload
		var data = await Supplier.findOne({
			reference: req.params.reference
		}).populate({ path: 'concernedProducts', select: ['_id', 'name'], model: ProcurementItem })

		// all procurement Items
		var procurementItems = await ProcurementItem.find()

		if (data.drop === true) {

			req.flash({
				type: 'warning',
				msg: 'Restore Data to make any Update!'
			})

			redirectTo(req, res, {
				url: mainUrl + 'suppliers/',
				reference: req.params.reference
			})

		}

		res.render(view + 'edit', {
			item: data,
			procurementItems: procurementItems,
			csrfToken: req.csrfToken(),
			title: 'Edit Supplier | Edtyro'
		})

	} catch (error) {

		// console.log(error)

		req.flash({
			type: 'failure',
			msg: 'ERROR : AE001 - Something went wrong!'
		})

		redirectTo(req, res, {
			url: mainUrl + 'suppliers',
			reference: req.params.reference
		})

	}

})

/**
 * @name POST:/suppliers/edit
 *
 * @description edit applications
 */
router.post('/edit/:reference', csrfProtection, access('suppliers:edit'), async function (req, res, next) {

	// declarations
	var redirection = mainUrl + 'suppliers/edit/' + req.params.reference
	var msgType = 'default'
	var msgText = '.'

	var update = {
		nModified: -1
	}

	if (req.body._page === 'basic-details') {

		/* declarations */
		var publish = (req.body.publish === 'on')
		var publishApi = (req.body.publishApi === 'on')

		try {

			update = await Supplier.updateCustom(req.params.reference, {

				name: req.body.name,
				email: req.body.email,
				phoneNo: req.body.phoneNo,
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

	} else if (req.body._page === 'advance-details') {

		try {

			update = await Supplier.updateCustom(req.params.reference, {
				state: req.body.state,
				pincode: req.body.pincode,
				approvedBy: req.body.approvedBy
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

	} else if (req.body._page === 'cps') {

		var concernedProducts = []

		// concerned products
		if (Array.isArray(req.body.concernedProducts)) {

			concernedProducts = req.body.concernedProducts

		} else {

			concernedProducts.push(req.body.concernedProducts)

		}

		try {

			update = await Supplier.updateCustom(req.params.reference, {
				concernedProducts: concernedProducts
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

			console.log(error)

			msgType = 'danger'
			msgText = 'ERROR : PD004 - Data couldn\'t be updated.'

		}

	}

	req.flash({
		type: msgType,
		msg: msgText
	})

	redirectTo(req, res, {
		url: redirection
	})

})

/**
 * @name GET:/suppliers/delete/reference
 *
 * @description delete suppliers
 */
router.get('/delete/:reference', access('suppliers:delete'), async function (req, res, next) {

	try {

		await Supplier.delete(req.params.reference)
		req.flash({
			type: 'default',
			msg: 'Entry ' + req.params.reference + ' deleted successfully!! <a href="' + mainUrl + 'suppliers/restore/' + req.params.reference + '">UNDO</a>'
		})

		redirectTo(req, res, {
			url: mainUrl + 'suppliers/'
		})

	} catch (error) {

		// console.log(error)
		req.flash({
			type: 'danger',
			msg: 'ERROR : QTD001 - Entry couldn\'t be deleted.'
		})

		redirectTo(req, res, {
			url: mainUrl + 'suppliers/',
			reference: req.params.reference
		})

	}

})

/**
	* @name GET:/suppliers/restore/reference
	*
	* @description restore suppliers
	*/
router.get('/restore/:reference', access('suppliers:purge'), async function (req, res, next) {

	try {

		await Supplier.restore(req.params.reference)
		req.flash({
			type: 'info',
			msg: 'Entry restored successfully!!'
		})

		redirectTo(req, res, {
			url: mainUrl + 'suppliers/',
			reference: req.params.reference
		})

	} catch (error) {

		// console.log(error)
		req.flash({
			type: 'failure',
			msg: 'ERROR : QTD001 - Entry couldn\'t be restored.'
		})

		redirectTo(req, res, {
			url: mainUrl + 'suppliers/',
			reference: req.params.reference
		})

	}

})

/**
	* @name GET:/suppliers/purge/reference
	*
	* @description purge suppliers
	*/
router.get('/purge/:reference', access('suppliers:purge'), async function (req, res, next) {

	try {

		await Supplier.purge(req.params.reference)

		req.flash({
			type: 'success',
			msg: 'Entry purged successfully!!'
		})

		redirectTo(req, res, {
			url: mainUrl + 'suppliers/'
		})

	} catch (error) {

		// console.log(error)
		req.flash({
			type: 'failure',
			msg: 'ERROR : QTP001 - Entry couldn\'t be purged.'
		})

		redirectTo(req, res, {
			url: mainUrl + 'suppliers/',
			reference: req.params.reference
		})

	}

})

module.exports = router
