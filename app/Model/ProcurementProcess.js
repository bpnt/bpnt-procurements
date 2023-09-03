'use strict'

/**
 * @file ProcurementProcess
 *
 * @description ProcurementProcess Model
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
const ProcurementProcessSchema = require('../Schema/ProcurementProcessSchema')

// register model
const Model = conn.model('ProcurementProcess', ProcurementProcessSchema)

/**
 * @class ProcurementProcess
 *
 * @description ProcurementProcess Class
 *
 * @extends Model
 */
class ProcurementProcess extends Model {

    /**
	 * @function saveBasic
	 *
	 * @description Save basic information
	 *
	 * @param {Object} prms data object
	 * @param {String} prms.name name
	 * @param {Object} prms.procurementItemId object passed from ProcurementItem
     * @param {Object} prms.supplierId object passed from Supplier
	 * @param {String|Array} prms.approvals approvals
	 * @param {String|Array} prms.ssjForms ssjForms
	 * @param {String|Array} prms.payments payments
	 * @param {String|Array} prms.authorizations authorizations
	 * @param {Object} ctls data control oject
	 * @param {Boolean} ctls.publish publish or not
	 * @param {Boolean} ctls.publishApi publishApi or not
	 *
	 * @returns {Object} ProcurementProcess
	 */
    static async saveBasic (prms, ctls) {

        /* declarations */

		// reference
		var reference = await referenceGenerator({
			model: Model,
			length: 10
		})

        // object with required parameters
        var data = new ProcurementProcess({
			reference: reference,
			name: prms.name,
            procurementItemId: prms.procurementItemId,
            supplierId: prms.supplierId,
        })
        
        // /* optional parameters */

        if (typeof prms !== 'undefined' && prms) {
        
            // approvals
            if (typeof prms.approvals !== 'undefined' && prms.approvals) {

                data.approvals = prms.approvals

            }
            
            // ssjForms
            if (typeof prms.ssjForms !== 'undefined' && prms.ssjForms) {

                data.ssjForms = prms.ssjForms

			}
			
			// payments
            if (typeof prms.payments !== 'undefined' && prms.payments) {

                data.payments = prms.payments

			}
			
			// authorizations
            if (typeof prms.authorizations !== 'undefined' && prms.authorizations) {

                data.authorizations = prms.authorizations

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
	 * @returns {Object} ProcurementProcess
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

module.exports = ProcurementProcess