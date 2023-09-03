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

var ProcurementContractProcess = require('../Model/ProcurementContractProcess')

/* Library declarations */
var access = require(require('../../config/paths').functions).access
var redirectTo = require(require('../../config/paths').functions).redirectTo

/* Paths */
var dirConfig = require('../../config/app').uploads
var mainUrl = require('../../config/app').mainUrl
var view = require('../../config/app').view + 'modules/procurementContractProcesses/'

/* vars */
// upload directory
var dir = dirConfig + '/' + 'procurementContractProcesses'

// upload setup
const upload = require(require('../../config/paths').functions).uploader({
	dir: dir,
	mimeTypes: [
		'application/pdf',
		'image/jpeg',
		'image/png'
	],
	limit: 25 // 25MB
})

// Configuring multiple upload
var uploads = upload.fields([{ name: 'contracts', maxCount: 5 }])

/**
 * @name GET:/procurementContractProcesses
 *
 * @description index url
 */
router.get('/', access('procurementContractProcesses:index'), async function (req, res, next) {

	// declarations
	var perPage = 10
	var pageNo = req.query.page
	var totalCount = await ProcurementContractProcess.countDocuments({})
	var pages = Math.ceil(totalCount / perPage)

	if (pageNo <= 0) {

		redirectTo(req, res, {
			url: mainUrl + 'procurement-contract-processes'
		})

	}

	var items = await ProcurementContractProcess.find()
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

	res.render(view + 'index', {
		title: 'Procurement Contract Processes | Edtyro',
		items: items,
		pageNo: pageNo,
		totalCount: totalCount,
		pages: pages
	})

})

/**
 * @name GET:/procurementContractProcesses/add
 *
 * @description add procurementContractProcesses
 */
router.get('/add', csrfProtection, access('procurementContractProcesses:add'), async function (req, res, next) {

	res.render(view + 'add', {
		csrfToken: req.csrfToken(),
		title: 'Add Procurement Contract Processes | Edtyro'
	})

})

/**
 * @name POST:/procurement-contract-processes/add
 *
 * @description add application
 */
router.post('/add', uploads, parseForm, csrfProtection, access('procurementContractProcesses:add'), async function (req, res, next) {

	/* declarations */
	var publish = (req.body.publish === 'on')
	var publishApi = (req.body.publishApi === 'on')

	var contracts = []

	try {

		// Contracts
		if (req.files.contracts !== 'undefined' && req.files.contracts[0].filename) {

			if (Array.isArray(req.body.authorizedBy)) {

				var dl = req.body.authorizedBy
				var a = req.body.authorizedAt

				for (var i = 0; i < dl.length; i++) {

					var extension = req.files.contracts[i].mimetype.split('/')
					var document = req.files.contracts[i].filename + '.' + extension[1]

					contracts.push({
						document: document,
						authorizedBy: dl[i],
						authorizedAt: a[i]
					})

				}

			} else {

				var extensionSingle = req.files.contracts[0].mimetype.split('/')
				var documentSingle = req.files.contracts[0].filename + '.' + extensionSingle[1]

				contracts.push({
					document: documentSingle,
					authorizedBy: req.body.authorizedBy,
					authorizedAt: req.body.authorizedAt
				})

			}

		}

		var save = await ProcurementContractProcess.saveBasic({
			contracts: contracts
		}, {
			publish: publish,
			publishApi: publishApi
		})

		if (save) {

			/* create directory with reference */
			var ndir = dir + '/' + save.reference
			if (!fs.existsSync(ndir)) {

				fs.mkdirSync(ndir, { recursive: true }, err => {

					if (err) {

						req.flash({
							type: 'failure',
							msg: 'ERROR: PD001 - Failed to create Directory.'
						})

					}

				})

			}

			/* rename contract file with path */

			var adLen = req.files.contracts.length
			for (var j = 0; j < adLen; j++) {

				var extensionRename = req.files.contracts[j].mimetype.split('/')
				var documentRename = req.files.contracts[j].filename + '.' + extensionRename[1]

				fs.rename(req.files.contracts[j].path, ndir + '/' + documentRename, function (err) {

					if (err) {

						req.flash({
							type: 'failure',

							msg: 'ERROR: PD002 - Error in renaming additional document number ' + j + ' filename.'

						})

					}

				})

			}

			req.flash({
				type: 'success',
				msg: 'Data saved successfully.'
			})

			redirectTo(req, res, {
				url: mainUrl + 'procurement-contract-processes/'
			})

		} else {

			req.flash({
				type: 'failure',
				msg: 'ERROR : LA001 - Data couldn\'d be saved.'
			})

			redirectTo(req, res, {
				url: mainUrl + 'procurement-contract-processes/add'
			})

		}

	} catch (error) {

		// console.log(error)

		req.flash({
			type: 'failure',
			msg: 'ERROR : LA002 - Data couldn\'d be saved.'
		})

		redirectTo(req, res, {
			url: mainUrl + 'procurement-contract-processes/add'
		})

	}

})

/**
 * @name GET:/procurementContractProcesses/view
 *
 * @description edit procurementContractProcesses
 */
router.get('/view/:reference', csrfProtection, access('procurementContractProcesses:view'), async function (req, res, next) {

	try {

		var data = await ProcurementContractProcess.findByReference(req.params.reference)

		if (data.drop === true) {

			req.flash({
				type: 'warning',
				msg: 'Restore Data to view!'
			})

			redirectTo(req, res, {
				url: mainUrl + 'procurement-contract-processes/',
				reference: req.params.reference
			})

		}

		res.render(view + 'view', {
			item: data,
			csrfToken: req.csrfToken(),
			title: 'View Procurement Contract Process | Edtyro'
		})

	} catch (error) {

		// console.log(error)

		req.flash({
			type: 'failure',
			msg: 'ERROR : CE001 - Something went wrong!'
		})

		redirectTo(req, res, {
			url: mainUrl + 'procurement-contract-processes',
			reference: req.params.reference
		})

	}

})

/**
 * @name GET:/procurementContractProcesses/edit
 *
 * @description edit procurementContractProcesses
 */
router.get('/edit/:reference', csrfProtection, access('procurementContractProcesses:edit'), async function (req, res, next) {

	try {

		var data = await ProcurementContractProcess.findByReference(req.params.reference)

		if (data.drop === true) {

			req.flash({
				type: 'warning',
				msg: 'Restore Data to make any Update!'
			})

			redirectTo(req, res, {
				url: mainUrl + 'procurement-contract-processes/',
				reference: req.params.reference
			})

		}

		res.render(view + 'edit', {
			item: data,
			csrfToken: req.csrfToken(),
			title: 'Edit Procurement Contract Processes | Edtyro'
		})

	} catch (error) {

		// console.log(error)

		req.flash({
			type: 'danger',
			msg: 'ERROR : QTE001 - Something went wrong!'
		})

		redirectTo(req, res, {
			url: mainUrl + 'procurement-contract-processes',
			reference: req.params.reference
		})

	}

})

/**
 * @name POST:/procurement-contract-processes/edit
 *
 * @description edit procurementContractProcesses
 */
router.post('/edit/:reference', uploads, csrfProtection, access('procurementContractProcesses:edit'), async function (req, res, next) {

	// declarations
	var redirection = mainUrl + 'procurement-contract-processes/edit/' + req.params.reference
	var msgType = 'default'
	var msgText = '.'

	var update = {
		nModified: -1
	}

	if (req.body._page === 'basic-details') {

		// pre work if remove is set
		try {

			if (req.body.remove) {

				var remove = []

				// remove
				if (Array.isArray(req.body.remove)) {

					remove = req.body.remove

				} else {

					remove.push(req.body.remove)

				}

				// remove all contracts if remove is set for document
				for (var n = 0; n < remove.length; n++) {

					await ProcurementContractProcess.updateOne({
						reference: req.params.reference
					}, {
						$pull: {
							contracts: { document: remove[n] }
						}
					})

				}

				// info message if file is removed
				req.flash({
					type: 'warning',
					msg: 'Some file(s) removed.'
				})

			}

		} catch (error) {

			// console.log(error)

			req.flash({
				type: 'failure',
				msg: 'ERROR : PCP001 - File couldn\'t be removed.'
			})

		}


		/* declarations */
		var publish = (req.body.publish === 'on')
		var publishApi = (req.body.publishApi === 'on')

		// var additionalDocuments = []
		var ndir = dir + '/' + req.params.reference

		try {

			// get the element to update
			var obj = await ProcurementContractProcess.findByReference(req.params.reference)

			obj.publish = publish
			obj.publishApi = publishApi

			// Contracts files
			if (req.files.contracts) {

				if (req.files.contracts !== 'undefined' && req.files.contracts[0].filename) {

					if (Array.isArray(req.body.authorizedBy)) {

						var dl = req.body.authorizedBy
						var a = req.body.authorizedAt

						for (var i = 0; i < dl.length; i++) {

							var extension = req.files.contracts[i].mimetype.split('/')
							var document = req.files.contracts[i].filename + '.' + extension[1]

							obj.contracts.push({
								document: document,
								authorizedBy: dl[i],
								authorizedAt: a[i]
							})

						}

					} else {

						var extensionSingle = req.files.contracts[0].mimetype.split('/')
						var documentSingle = req.files.contracts[0].filename + '.' + extensionSingle[1]

						obj.contracts.push({
							document: documentSingle,
							authorizedBy: req.body.authorizedBy,
							authorizedAt: req.body.authorizedAt
						})

					}

					var save = await obj.save()

				}

			} else {

				update = await ProcurementContractProcess.updateCustom(req.params.reference, {
					publish: publish,
					publishApi: publishApi
				})

			}

			// message text
			if (save) {

				/* create directory with reference */
				if (!fs.existsSync(ndir)) {

					fs.mkdirSync(ndir, { recursive: true }, err => {

						if (err) {

							req.flash({
								type: 'failure',
								msg: 'ERROR: PCP002 - Failed to create Directory.'
							})

						}

					})

				}

				/* rename contract file with path */

				var adLen = req.files.contracts.length
				for (var j = 0; j < adLen; j++) {

					var extensionRename = req.files.contracts[j].mimetype.split('/')
					var documentRename = req.files.contracts[j].filename + '.' + extensionRename[1]

					fs.rename(req.files.contracts[j].path, ndir + '/' + documentRename, function (err) {

						if (err) {

							req.flash({
								type: 'failure',

								msg: 'ERROR: PCP003 - Error in renaming additional document number ' + j + ' filename.'

							})

						}

					})

				}

				msgType = 'success'
				msgText = 'Basic Details updated.'

			} else if (update.nModified > 0) {

				msgType = 'success'
				msgText = 'Publish Details updated.'

			} else {

				msgType = 'failure'
				msgText = 'ERROR : PCP004 - Data couldn\'t be updated.'

			}

		} catch (error) {

			// console.log(error)

			msgType = 'failure'
			msgText = 'ERROR : PCP005 - Data couldn\'t be updated.'

		}

	} else if (req.body._page === 'correspondences') {

		var correspondences = []

		try {

			// correspondences
			if (Array.isArray(req.body.request)) {

				var c = req.body.request
				var b = req.body.renewal
				var a = req.body.approvedBy
				var d = req.body.date

				for (var j = 0; j < c.length; j++) {

					correspondences.push({
						request: c[j],
						renewal: b[j],
						approvedBy: a[j],
						date: d[j]
					})

				}

			} else {

				correspondences.push({
					request: req.body.request,
					renewal: req.body.renewal,
					approvedBy: req.body.approvedBy,
					date: req.body.date
				})

			}

			update = await ProcurementContractProcess.updateCustom(req.params.reference, {
				correspondences: correspondences
			})

			// message text
			if (update.nModified > 0) {

				msgType = 'success'
				msgText = 'Correspondences updated.'

			} else {

				msgType = 'failure'
				msgText = 'ERROR : PCP006 - Data couldn\'t be updated.'

			}

		} catch (error) {

			// console.log(error)

			msgType = 'failure'
			msgText = 'ERROR : PCP007 - Data couldn\'t be updated.'

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
 * @name GET:/procurementContractProcesses/delete/reference
 *
 * @description delete procurementContractProcesses
 */
router.get('/delete/:reference', access('procurementContractProcesses:delete'), async function (req, res, next) {

	try {

		await ProcurementContractProcess.delete(req.params.reference)
		req.flash({
			type: 'default',
			msg: 'Entry ' + req.params.reference + ' deleted successfully!! <a href="' + mainUrl + 'procurement-contract-processes/restore/' + req.params.reference + '">UNDO</a>'
		})

		redirectTo(req, res, {
			url: mainUrl + 'procurement-contract-processes/'
		})

	} catch (error) {

		// console.log(error)
		req.flash({
			type: 'danger',
			msg: 'ERROR : QTD001 - Entry couldn\'t be deleted.'
		})

		redirectTo(req, res, {
			url: mainUrl + 'procurement-contract-processes/',
			reference: req.params.reference
		})

	}

})

/**
	* @name GET:/procurementContractProcesses/restore/reference
	*
	* @description restore procurementContractProcesses
	*/
router.get('/restore/:reference', access('procurementContractProcesses:purge'), async function (req, res, next) {

	try {

		await ProcurementContractProcess.restore(req.params.reference)
		req.flash({
			type: 'info',
			msg: 'Entry restored successfully!!'
		})

		redirectTo(req, res, {
			url: mainUrl + 'procurement-contract-processes/',
			reference: req.params.reference
		})

	} catch (error) {

		// console.log(error)
		req.flash({
			type: 'danger',
			msg: 'ERROR : QTD001 - Entry couldn\'t be restored.'
		})

		redirectTo(req, res, {
			url: mainUrl + 'procurement-contract-processes/',
			reference: req.params.reference
		})

	}

})

/**
	* @name GET:/procurementContractProcesses/purge/reference
	*
	* @description purge procurementContractProcesses
	*/
router.get('/purge/:reference', access('procurementContractProcesses:purge'), async function (req, res, next) {

	try {

		await ProcurementContractProcess.purge(req.params.reference)

		req.flash({
			type: 'success',
			msg: 'Entry purged successfully!!'
		})

		redirectTo(req, res, {
			url: mainUrl + 'procurement-contract-processes/'
		})

	} catch (error) {

		// console.log(error)
		req.flash({
			type: 'danger',
			msg: 'ERROR : QTP001 - Entry couldn\'t be purged.'
		})

		redirectTo(req, res, {
			url: mainUrl + 'procurement-contract-processes/',
			reference: req.params.reference
		})

	}

})

module.exports = router
