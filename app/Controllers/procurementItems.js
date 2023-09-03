var express = require('express')
var router = express.Router()

/* imports */
var csrf = require('csurf')
var bodyParser = require('body-parser')

// file & upload
var fs = require('fs')

// pre work for csrf
var csrfProtection = csrf({ cookie: true })
var parseForm = bodyParser.urlencoded({ extended: false })

var ProcurementItem = require('../Model/ProcurementItem')

/* Library declarations */
var access = require(require('../../config/paths').functions).access
var expressions = require(require('../../config/paths').functions).expressions
var redirectTo = require(require('../../config/paths').functions).redirectTo

/* Paths */
var dirConfig = require('../../config/app').uploads
var mainUrl = require('../../config/app').mainUrl
var view = require('../../config/app').view + 'modules/procurementItems/'

/* vars */
// upload directory
var dir = dirConfig + '/' + 'procurementItems'

// upload setup
const upload = require(require('../../config/paths').functions).uploader({
	dir: dir,
	mimeTypes: [
		'image/jpeg',
		'image/png'
	],
	limit: 25 // 25MB
})

/**
 * @name GET:/procurementItems
 *
 * @description index url
 */
router.get('/', access('procurementItems:index'), async function (req, res, next) {

	// declarations
	var perPage = 10
	var pageNo = req.query.page ? req.query.page : 1
	var totalCount = await ProcurementItem.countDocuments({})
	var pages = Math.ceil(totalCount / perPage)

	if (pageNo <= 0) {

		redirectTo(req, res, {
			url: mainUrl + 'procurement-items'
		})

	}

	var items = []
	var totalCount = 0
	var searchUrl = ''

	if (req.query.search) {

		const regex = new RegExp(expressions.escapeRegex(req.query.search), 'gi')

		totalCount = await ProcurementItem.countDocuments({
			$or: [
				{ category: regex },
				{ name: regex },
				{ item: regex },
				{ cost: regex }
			]
		})

		if (totalCount < 1) {

			return res.send('No category match that query, please try again.')

		} else {

			items = await ProcurementItem.find({
				$or: [
					{ category: regex },
					{ name: regex },
					{ item: regex },
					{ cost: regex }
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
		totalCount = await ProcurementItem.countDocuments({})

	items = await ProcurementItem.find()
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
		title: 'Procurement Item | Edtyro',
		items: items,
		pageNo: pageNo,
		totalCount: totalCount,
		pages: pages,
		searchUrl: searchUrl
	})

})

/**
 * @name GET:/procurementItems/add
 *
 * @description add procurementItems
 */
router.get('/add', csrfProtection, access('procurementItems:add'), async function (req, res, next) {

	res.render(view + 'add', {
		csrfToken: req.csrfToken(),
		title: 'Add Procurement Item | Edtyro',
	})

})

/**
 * @name POST:/procurementItems/add
 *
 * @description add procurementItems
 */
router.post('/add', upload.single('image'), parseForm, csrfProtection, access('procurementItems:add'), async function (req, res, next) {

	/* declarations */
	var publish = (req.body.publish === 'on')
	var publishApi = (req.body.publishApi === 'on')

	try {

		var save = false

		if (typeof req.file !== 'undefined' && req.file.filename) {

			var extension = req.file.mimetype.split('/')
			var image = req.file.filename + '.' + extension[1]

			save = await ProcurementItem.saveBasic({
				item: req.body.item,
				name: req.body.name,
				description: req.body.description,
				cost: req.body.cost,
				quantity: req.body.quantity,
				image: image,
			}, {
				publish: publish,
				publishApi: publishApi
			})

			/* create directory with reference */
			var ndir = dir + '/' + save.reference
			if (!fs.existsSync(ndir)) {

				fs.mkdirSync(ndir, { recursive: true }, err => {

					if (err) {

						req.flash({
							type: 'failure',
							msg: 'ERROR: DA001 - Failed to create Directory.'
						})

					}

				})

			}

			/* rename file with path */
			fs.rename(req.file.path, ndir + '/' + req.file.filename + '.' + extension[1], function (err) {

				if (err) {

					req.flash({
						type: 'failure',
						msg: 'ERROR: DA002 - Error in renaming document filename.'
					})

				}

			})

			if (save) {

				req.flash({
					type: 'success',
					msg: 'Data saved successfully.'
				})

				redirectTo(req, res, {
					url: mainUrl + 'procurement-items/edit/' + save.reference
				})

			} else {

				req.flash({
					type: 'failure',
					msg: 'ERROR : DA003 - Data couldn\'d be saved.'
				})

				redirectTo(req, res, {
					url: mainUrl + 'procurement-items/add'
				})

			}

		} else {

			req.flash({
				type: 'failure',
				msg: 'ERROR: DA004 - Document is required.'
			})

		}

	} catch (error) {

		// console.log(error)

		req.flash({
			type: 'failure',
			msg: 'ERROR : DA005 - Data couldn\'d be saved.'
		})

		redirectTo(req, res, {
			url: mainUrl + 'procurement-items/add'
		})

	}

})

/**
 * @name GET:/procurementItems/view
 *
 * @description edit procurementItems
 */
router.get('/view/:reference', csrfProtection, access('procurementItems:view'), async function (req, res, next) {

	try {

		var data = await ProcurementItem.findByReference(req.params.reference)

		if (data.drop === true) {

			req.flash({
				type: 'warning',
				msg: 'Restore Data to view!'
			})

			redirectTo(req, res, {
				url: mainUrl + 'procurement-items/',
				reference: req.params.reference
			})

		}

		res.render(view + 'view', {
			item: data,
			csrfToken: req.csrfToken(),
			title: 'View Procurement Item | Edtyro'
		})

	} catch (error) {

		console.log(error)

		req.flash({
			type: 'failure',
			msg: 'ERROR : CE001 - Something went wrong!'
		})

		redirectTo(req, res, {
			url: mainUrl + 'procurement-items',
			reference: req.params.reference
		})

	}

})

/**
 * @name GET:/procurementItems/edit
 *
 * @description edit procurementItems
 */
router.get('/edit/:reference', csrfProtection, access('procurementItems:edit'), async function (req, res, next) {

	try {

		var data = await ProcurementItem.findByReference(req.params.reference)

		if (data.drop === true) {

			req.flash({
				type: 'warning',
				msg: 'Restore Data to make any Update!'
			})

			redirectTo(req, res, {
				url: mainUrl + 'procurement-items/',
				reference: req.params.reference
			})

		}

		res.render(view + 'edit', {
			item: data,
			csrfToken: req.csrfToken(),
			title: 'Edit Procurement Item | Edtyro'
		})

	} catch (error) {

		// console.log(error)

		req.flash({
			type: 'failure',
			msg: 'ERROR : AE001 - Something went wrong!'
		})

		redirectTo(req, res, {
			url: mainUrl + 'procurement-items',
			reference: req.params.reference
		})

	}

})

/**
 * @name POST:/procurementItems/edit
 *
 * @description edit applications
 */
router.post('/edit/:reference', upload.single('image'), csrfProtection, access('procurementItems:edit'), async function (req, res, next) {

	// declarations
	var redirection = mainUrl + 'procurement-items/edit/' + req.params.reference
	var msgType = 'default'
	var msgText = '.'

	if (req.body._page === 'basic-details') {

		try {

			/* declarations */
			var publish = (req.body.publish === 'on')
			var publishApi = (req.body.publishApi === 'on')

			var update = {
				nModified: -1
			}

			if (typeof req.file !== 'undefined' && req.file.filename) {

				var extension = req.file.mimetype.split('/')
				var image = req.file.filename + '.' + extension[1]

				update = await ProcurementItem.updateCustom(req.params.reference, {
					item: req.body.item,
					name: req.body.name,
					description: req.body.description,
					cost: req.body.cost,
					quantity: req.body.quantity,
					image: image,
					publish: publish,
					publishApi: publishApi
				})

				var ndir = dir + '/' + req.params.reference

				if (!fs.existsSync(ndir)) {

					fs.mkdirSync(ndir, { recursive: true }, err => {

						console.log(err)

					})

				}

				fs.rename(req.file.path, ndir + '/' + req.file.filename + '.' + extension[1], function (err) {

					if (err) {

						req.flash({
							type: 'failure',
							msg: 'ERROR: DE001 - Error in renaming icon filename.'
						})

					} else {

						req.flash({
							type: 'info',
							msg: 'Document File Updated'
						})

					}

				})

			} else {

				// update without document
				update = await ProcurementItem.updateCustom(req.params.reference, {
					item: req.body.item,
					name: req.body.name,
					description: req.body.description,
					cost: req.body.cost,
					quantity: req.body.quantity,
					image: image,
					publish: publish,
					publishApi: publishApi
				})

				req.flash({
					type: 'warning',
					msg: 'Document File Not Updated'
				})

			}

			// message text
			if (update.nModified > 0) {

				msgType = 'success'
				msgText = 'Document Basic details updated.'

			} else {

				msgType = 'failure'
				msgText = 'ERROR : DE002 - Data couldn\'t be updated.'

			}

		} catch (error) {

			// console.log(error)

			msgType = 'failure'
			msgText = 'ERROR : DE003 - Data couldn\'t be updated.'

		}

	} else if (req.body._page === 'specifications') {

		var specifications = []

		// steps
		if (Array.isArray(req.body.specificationDetail)) {

			var s = req.body.specificationDetail
			var d = req.body.label

			for (var i = 0; i < s.length; i++) {

				specifications.push({
					specificationDetail: s[i],
					label: d[i]
				})

			}

		} else {

			specifications.push({
				specificationDetail: req.body.specificationDetail,
				label: req.body.label
			})

		}

		try {

			update = await ProcurementItem.updateCustom(req.params.reference, {
				specifications: specifications
			})

			// message text
			if (update.nModified > 0) {

				msgType = 'success'
				msgText = 'Specifications updated.'

			} else {

				msgType = 'failure'
				msgText = 'ERROR : NE002 - Data couldn\'t be updated.'

			}

		} catch (error) {

			console.log(error)

			msgType = 'failure'
			msgText = 'ERROR : APE004 - Data couldn\'t be updated.'

		}

		redirection = redirection + '#specifications+'

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
 * @name GET:/procurementItems/delete/reference
 *
 * @description delete procurementItems
 */
router.get('/delete/:reference', access('procurementItems:delete'), async function (req, res, next) {

	try {

		await ProcurementItem.delete(req.params.reference)
		req.flash({
			type: 'default',
			msg: 'Entry ' + req.params.reference + ' deleted successfully!! <a href="' + mainUrl + 'procurement-items/restore/' + req.params.reference + '">UNDO</a>'
		})

		redirectTo(req, res, {
			url: mainUrl + 'procurement-items/'
		})

	} catch (error) {

		// console.log(error)
		req.flash({
			type: 'danger',
			msg: 'ERROR : QTD001 - Entry couldn\'t be deleted.'
		})

		redirectTo(req, res, {
			url: mainUrl + 'procurement-items/',
			reference: req.params.reference
		})

	}

})

/**
	* @name GET:/procurementItems/restore/reference
	*
	* @description restore procurementItems
	*/
router.get('/restore/:reference', access('procurementItems:purge'), async function (req, res, next) {

	try {

		await ProcurementItem.restore(req.params.reference)
		req.flash({
			type: 'info',
			msg: 'Entry restored successfully!!'
		})

		redirectTo(req, res, {
			url: mainUrl + 'procurement-items/',
			reference: req.params.reference
		})

	} catch (error) {

		// console.log(error)
		req.flash({
			type: 'failure',
			msg: 'ERROR : QTD001 - Entry couldn\'t be restored.'
		})

		redirectTo(req, res, {
			url: mainUrl + 'procurement-items/',
			reference: req.params.reference
		})

	}

})

/**
	* @name GET:/procurementItems/purge/reference
	*
	* @description purge procurementItems
	*/
router.get('/purge/:reference', access('procurementItems:purge'), async function (req, res, next) {

	try {

		await ProcurementItem.purge(req.params.reference)

		req.flash({
			type: 'success',
			msg: 'Entry purged successfully!!'
		})

		redirectTo(req, res, {
			url: mainUrl + 'procurement-items/'
		})

	} catch (error) {

		// console.log(error)
		req.flash({
			type: 'failure',
			msg: 'ERROR : QTP001 - Entry couldn\'t be purged.'
		})

		redirectTo(req, res, {
			url: mainUrl + 'procurement-items/',
			reference: req.params.reference
		})

	}

})

module.exports = router
