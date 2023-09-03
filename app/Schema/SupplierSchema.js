'use strict'

/**
 * @file SupplierSchema
 *
 * @description Supplier Schema
 *
 * @author Binisha Pant <bini@edtyro.com>
 * @version 1.0.0
 * @copyright Edtyro Private Limited, 2020
 */

/* Imports  & Declarations */
var Schema = require('mongoose').Schema

/**
 * @schema SupplierSchema
 *
 * @description Supplier Schema for Supplier
 *
 * @property {String} reference  reference key
 * @property {String} name  name of the supplier
 * @property {String} email email of the supplier
 * @property {String} phoneNo contact number of the supplier
 * @property {String} state state of supplier
 * @property {String} pincode pincode of state
 * @property {String|Array} concernedProducts correspondence address of the supplier
 * @property {String} approvedBy name of the approver
 * @property {Boolean} publish publish or not
 * @property {Boolean} publishApi publish Api or not
 * @property {Object} lock data locking feature
 * @property {Boolean} drop drop or not
 */

var SupplierSchema = new Schema({
	reference: {
		type: String,
		unique: true,
		required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phoneNo: {
        type: String,
        required: true
	},
    state: {
        type: String,
	},
	pincode: {
		type: String,
	},
    concernedProducts: [{
            type: Schema.Types.ObjectId,
			ref: 'ProcurementItem',
			required: false
	}],
	approvedBy: {
        type: String,
    },      
	publish: {
		type: Boolean,
		default: false
	},
	publishApi: {
		type: Boolean,
		default: false
	},
	lock: {
		status: {
			type: Boolean,
			default: null
		},
		by: {
			type: String,
			default: null
		},
		lockedAt: {
			type: Date
		}
	},
	drop: {
		type: Boolean,
		default: false
	}
},
{
	timestamps: true
})

module.exports = SupplierSchema
