'use strict'

/**
 * @file ProcurementProcessSchema
 *
 * @description Procurement Process Schema
 *
 * @author Binisha Pant <bini@edtyro.com>
 * @version 1.0.0
 * @copyright Edtyro Private Limited, 2020
 */

/* Imports  & Declarations */
var Schema = require('mongoose').Schema

/**
 * @schema ProcurementProcessSchema
 *
 * @description ProcurementProcess Schema for Procurement Application
 *
 * @property {String} reference  reference key
 * @property {String} name name
 * @property {String|Array} procurementItemId item id
 * @property {String|Array} supplierId supplier id
 * @property {String|Array} approvals comparison categories
 * @property {String} approvals.approvedBy name of the approver
 * @property {Date} approvals.approvedAt date when the order is approved
 * @property {String} approvals.remarks remarks given to item
 * @property {String|Array} ssjForms comparison categories
 * @property {Date} ssjForms.date date when the order is issued
 * @property {String} ssjForms.authorizedBy one who authorizes the data
 * @property {String} ssjForms.remarks justification
 * @property {String|Array} payments payments
 * @property {Date} payments.paymentdate date when the payment is to be done
 * @property {String} payments.approvedBy name of approver
 * @property {String} payments.assignedBy one who is assigned to pay
 * @property {String|Array} authorizations authorizations
 * @property {String} authorizations.authorizedBy one who authorizes
 * @property {Date} authorizations.authorizedAt one by whom it is authorized
 * @property {String} authorizations.remarks remarks given to item
 * @property {Boolean} publish publish or not
 * @property {Boolean} publishApi publish Api or not
 * @property {Object} lock data locking feature
 * @property {Boolean} drop drop or not
 */

var ProcurementProcessSchema = new Schema({
	reference: {
		type: String,
		unique: true,
		required: true
	},
	name: {
		type: String,
		required: true
	},
	procurementItemId: [{
		type: Schema.Types.ObjectId,
		ref: 'ProcurementItem',
		required: true
    }],
	supplierId: [{
		type: Schema.Types.ObjectId,
		ref: 'Supplier',
		required: true
	}],
	approvals: [{
		approvedBy: {
			type: String,
			required: false
        },
        approvedAt: {
            type: Date,
            required: true
        },
        remarks:{
            type: String,
            required: false
        },
    }],
	ssjForms: [{
		date: {
			type: Date,
			required: false
        },
        authorizedBy: {
            type: String,
            required: false
		},
		reason: {
            type: String,
            required: false
        },
	}],
	payments: [{
		paymentdate: {
			type: Date,
			required: false
        },
        approvedBy: {
            type: String,
            required: false
        },
        assignedBy:{
            type: String,
            required: true
        },
	}],
	authorizations: [{
		authorizedBy: {
			type: String,
			required: true
        },
        authorizedAt: {
            type: Date,
            required: false
        },
        remarks: {
            type: String,
            required: false
        },
	}],
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

module.exports = ProcurementProcessSchema
