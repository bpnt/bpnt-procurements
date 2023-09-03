'use strict'

/**
 * @file Supplier
 *
 * @description Supplier API Model for Procurement Application
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

// pre-registerations (only on object references)
const ProcurementItemSchema = require('../Schema/ProcurementItemSchema')
conn.model('ProcurementItem', ProcurementItemSchema)

// import schema
const SupplierSchema = require('../Schema/SupplierSchema')

// register model
const Model = conn.model('Supplier', SupplierSchema)

/**
 * @class Supplier
 *
 * @description Supplier
 *
 * @extends Model
 */
class Supplier extends Model {

	/**
	 * @function saveBasic
	 *
	 * @description Save basic information
	 *
	 * @param {Object} prms data object
	 * @param {String} prms.name name of supplier
     * @param {String} prms.email email of supplier
     * @param {String} prms.phoneNo contact number of the supplier
     * @param {String} prms.state state of supplier
	 * @param {String} prms.pincode pincode of state
	 * @param {Object} prms.concernedProducts correspondence address of the supplier
	 * @param {String} prms.approvedBy name of the approver
	 * @param {Object} ctls data control object
	 * @param {Boolean} ctls.publish publish or not
	 * @param {Boolean} ctls.publishApi publishApi or not
	 *
	 * @returns {Object} Supplier
	 */
    static async saveBasic (prms, ctls) {

        /* declarations */

		// reference
		var reference = await referenceGenerator({
			model: Model,
			length: 10
		})

        // object with required parameters
        var data = new Supplier({
            reference: reference,
            name: prms.name,
            email: prms.email,
            phoneNo: prms.phoneNo,
		})
		
        // /* optional parameters */

        if (typeof prms !== 'undefined' && prms) {
        
            // state
            if (typeof prms.state !== 'undefined' && prms.state) {

                data.state = prms.state

			}
			
            // pincode
            if (typeof prms.pincode !== 'undefined' && prms.pincode) {

                data.pincode = prms.pincode

            }
            
            // concernedProducts
            if (typeof prms.concernedProducts !== 'undefined' && prms.concernedProducts) {

                data.concernedProducts = prms.concernedProducts

			}
			
			// approvedBy
            if (typeof prms.approvedBy !== 'undefined' && prms.approvedBy) {

                data.approvedBy = prms.approvedBy

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

		return await Supplier.findPublishedByReference(savedObject.reference)

	}

	/**
	 * @function findPublished
	 *
	 * @description find published supplier
	 *
	 * @returns {Object|Array} Supplier
	 */
	static async findPublished () {

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
		}).populate('concernedProducts', {
			publish: 0,
			publishApi: 0,
			lock: 0,
			drop: 0,
			freeze: 0,
			_id: 0,
			__v: 0
		})
	}

	/**
	 * @function findPublishedByReference
	 *
	 * @description find published supplier of given reference
	 *
	 * @param {String} reference reference key
	 *
	 * @returns {Object} Supplier
	 */
	static async findPublishedByReference (reference) {

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
		}).populate('concernedProducts', {
			publish: 0,
			publishApi: 0,
			lock: 0,
			drop: 0,
			freeze: 0,
			_id: 0,
			__v: 0
		})
	}

}

module.exports = Supplier