'use strict'

/**
 * @file ProcurementContractProcessSchema
 *
 * @description ProcurementContractProcess Schema
 *
 * @author Binisha Pant <bini@edtyro.com>
 * @version 1.0.0
 * @copyright Edtyro Private Limited, 2020
 */

/* Imports  & Declarations */
var Schema = require('mongoose').Schema

/**
 * @schema ProcurementContractProcessSchema
 *
 * @description Procurement Contract Process Schema for Procurement Application
 *
 * @property {String} reference  reference key
 * @property {String|Array} contracts contracts
 * @property {String} contracts.document required documents
 * @property {Date} contracts.authorizedAt date when the contract is done
 * @property {String} contracts.authorizedBy name of person who signs contract
 * @property {String|Array} correspondences correspondance
 * @property {String} correspondences.request request to be send to contractors
 * @property {String} correspondences.renewal renewal
 * @property {String} correspondences.approvedBy approval of contract
 * @property {Date} correspondences.date renewal
 * @property {Boolean} publish publish or not
 * @property {Boolean} publishApi publish Api or not
 * @property {Object} lock data locking feature
 * @property {Boolean} drop drop or not
 */

var ProcurementContractProcessSchema = new Schema({
	reference: {
		type: String,
		unique: true,
		required: true
    },
	contracts: [{
		document: {
            type: String,
            required: true
        },
		authorizedAt: {
			type: Date,
			required: true
        },
        authorizedBy: {
            type: String,
            required: true
        },
    }],
	correspondences: [{
		request: {
			type: String,
			required: true
        },
        renewal: {
            type: String,
            required: true
        },
        approvedBy: {
            type: String,
            required: true
		},
        date: {
            type: Date,
            required: true
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

module.exports = ProcurementContractProcessSchema