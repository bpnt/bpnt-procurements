'use strict'

/**
 * @file Supplier
 *
 * @description Supplier Model
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
const SupplierSchema = require('../Schema/SupplierSchema')

// register model
const Model = conn.model('Supplier', SupplierSchema)

/**
 * @class Supplier
 *
 * @description Supplier Class
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
	 * @returns {Object} Supplier
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

module.exports = Supplier