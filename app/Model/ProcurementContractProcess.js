'use strict'

/**
 * @file ProcurementContractProcess
 *
 * @description ProcurementContractProcess Model
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
 * @description ProcurementContractProcess Class
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
    static async saveBasic (prms, ctls) {

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
            correspondences: prms.correspondences,
		})
		
        /* optional control parameters */

		if (typeof prms !== 'undefined' && ctls) {

			// publish
			if (typeof ctls.publish !== 'undefined' && ctls.publish) {

				data.publish = ctls.publish

			}

			// publishApi
			if (typeof ctls.publishApi !== 'undefined' && ctls.publishApi) {

				data.publishApi = ctls.publishApi

			}

        }
        
        return await data.save()
    }

    /**
	 * @function updateCustom
	 *
	 * @description update custom entries
	 *
	 * @param {String} reference reference key
	 * @param {Object} data update Object
	 *
	 * @returns {Object} Update Status
	 */
	static async updateCustom (
		reference,
		data
	) {

		return await Model.updateOne({ reference: reference }, { $set: data })

	}

	/**
	 * @function findByReference
	 *
	 * @description find by reference
	 *
	 * @param {String} reference reference key
	 *
	 * @returns {Object} ProcurementContractProcess
	 */
	static async findByReference (reference) {

		return await Model.findOne({ reference: reference })

    }
    
    /**
	 * @function delete
	 *
	 * @description temporary/soft delete
	 *
	 * @param {String} reference reference key
	 *
	 * @returns {Object} Update Status
	 */
	static async delete (reference) {

		var data = {
			drop: true
		}

		return await Model.updateOne({ reference: reference }, { $set: data })

	}

	/**
	 * @function restore
	 *
	 * @description restore deleted
	 *
	 * @param {String} reference reference key
	 *
	 * @returns {Object} Update Status
	 */
	static async restore (reference) {

		var data = {
			drop: false
		}

		return await Model.updateOne({ reference: reference }, { $set: data })

	}

	/**
	 * @function purge
	 *
	 * @description permanent delete
	 *
	 * @param {String} reference reference key
	 *
	 * @returns {Object} delete Status
	 */
	static async purge (reference) {

		return await Model.deleteOne({ reference: reference })

	}
}

module.exports = ProcurementContractProcess