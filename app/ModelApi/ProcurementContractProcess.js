'use strict'

/**
 * @file ProcurementContractProcess
 *
 * @description ProcurementContractProcess API Model for Procurement Application
 *
 * @author Srishti Khare <srishti@edtyro.com>
 * @version 1.0.0
 * @copyright Edtyro Private Limited, 2020
 */

/* imports */

// connection
const conn = require(require('../../config/paths').connection).on()

// reference Generator
const referenceGenerator = require(require('../../config/paths').helpers).referenceGenerator

// slugify
const slugify = require(require('../../config/paths').helpers).slugify

// import schema
const ProcurementContractProcessSchema = require('../Schema/ProcurementContractProcessSchema')

// register model
const Model = conn.model('ProcurementContractProcess', ProcurementContractProcessSchema)

/**
 * @class ProcurementContractProcess
 *
 * @description ProcurementContractProcess
 *
 * @extends Model
 */
class ProcurementContractProcess extends Model {

	/**
	* @function saveBasic
	*
	* @description Save basic information
	*
	* @param {Object} prms data object
	* @param {String|Array} prms.contracts contracts
	* @param {String|Array} prms.correspondences correspondences
	* @param {Object} ctls data control oject
	* @param {Boolean} ctls.publish publish or not
	* @param {Boolean} ctls.publishApi publishApi or not
	*
	* @returns {Object} ProcurementContractProcess
	*/
	static async saveBasic(prms, ctls) {

		/* declarations */

		// reference
		var reference = await referenceGenerator({
			model: Model,
			length: 10
		})

		// object with required parameters
		var data = new ProcurementContractProcess({
			reference: reference,
			contracts: prms.contracts,
			correspondences: prms.correspondences
		})
		/* optional parameters */


		if (typeof prms !== 'undefined' && prms) {

			// description
			if (typeof prms.description !== 'undefined' && prms.description) {

				data.description = prms.description

			}

			// image
			if (typeof prms.image !== 'undefined' && prms.image) {

				data.image = prms.image

			}
		}

		/* optional control parameters */

		if (typeof ctls !== 'undefined' && ctls) {

			// publish
			if (typeof ctls.publish !== 'undefined' && ctls.publish) {

				data.publish = ctls.publish

			}

			// publishApi
			if (typeof ctls.publishApi !== 'undefined' && ctls.publishApi) {

				data.publishApi = ctls.publishApi

			}

		}


		var savedObject = await data.save()

		return await ProcurementContractProcess.findPublishedByReference(savedObject.reference)

	}

	/**
	 * @function findPublished
	 *
	 * @description find published ProcurementContractProcess
	 *
	 * @returns {Object|Array} ProcurementContractProcess
	 */
	static async findPublished() {

		return await Model.find({
			publish: true,
			publishApi: true,
			drop: false
		}).select({
			publish: 0,
			publishApi: 0,
			drop: 0,
			lock: 0,
			_id: 0,
			__v: 0
		})

	}

	/**
	 * @function findPublishedByReference
	 *
	 * @description find published author of given reference
	 *
	 * @param {String} reference reference key
	 *
	 * @returns {Object} ProcurementContractProcess
	 */
	static async findPublishedByReference(reference) {

		return await Model.findOne({
			reference: reference,
			publish: true,
			publishApi: true,
			drop: false
		}).select({
			publish: 0,
			publishApi: 0,
			lock: 0,
			drop: 0,
			_id: 0,
			__v: 0
		})

	}

}

module.exports = ProcurementContractProcess
