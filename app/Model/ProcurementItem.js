'use strict'

/**
 * @file ProcurementItem
 *
 * @description ProcurementItem Model
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
const ProcurementItemSchema = require('../Schema/ProcurementItemSchema')

// register model
const Model = conn.model('ProcurementItem', ProcurementItemSchema)

/**
 * @class ProcurementItem
 *
 * @description ProcurementItem Class
 *
 * @extends Model
 */
class ProcurementItem extends Model {

    /**
	 * @function saveBasic
	 *
	 * @description Save basic information
	 *
	 * @param {Object} prms data object
	 * @param {String} prms.name name of item
     * @param {String} prms.item items to be ordered
     * @param {String} prms.cost cost of item
     * @param {string} prms.quantity quantity of item
	 * @param {Object} ctls data control oject
	 * @param {Boolean} ctls.publish publish or not
	 * @param {Boolean} ctls.publishApi publishApi or not
	 *
	 * @returns {Object} ProcurementItem
	 */
    static async saveBasic (prms, ctls) {

        /* declarations */

		// reference
		var reference = await referenceGenerator({
			model: Model,
			length: 10
		})

        // object with required parameters
        var data = new ProcurementItem({
            reference: reference,
            name: prms.name,
            item: prms.item,
            cost: prms.cost,
            quantity: prms.quantity
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
	 * @returns {Object} ProcurementItem
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

module.exports = ProcurementItem