'use strict'

/**
 * @file ProcurementItemSchema
 *
 * @description ProcurementItem Schema
 *
 * @author Binisha Pant <bini@edtyro.com>
 * @version 1.0.0
 * @copyright Edtyro Private Limited, 2020
 */

/* Imports  & Declarations */
var Schema = require('mongoose').Schema

/**
 * @schema ProcurementItemSchema
 *
 * @description ProcurementItem Schema for Procurement Application
 *
 * @property {String} reference  reference key
 * @property {String} name name of supplier
 * @property {String} item  items to be ordered
 * @property {String} description description of the item
 * @property {String} image image of the item
 * @property {String} cost cost of item
 * @property {String} quantity quantity of item
 * @property {String|Array} specifications tracking
 * @property {String} specifications.specificationDetail specifications
 * @property {String} specifications.label specification label
 * @property {Boolean} publish publish or not
 * @property {Boolean} publishApi publish Api or not
 * @property {Object} lock data locking feature
 * @property {Boolean} drop drop or not
 */

var ProcurementItemSchema = new Schema({
	reference: {
		type: String,
		unique: true,
		required: true
    },
	name: {
		type: String,
		required: true
	},
	item: {
		type: String,
		required: true
	},
	description:{
		type: String,
		required: false
	},
	image: {
		type: String,
		required: false
	},
	cost: {
		type: String,
		required: true
	},
	quantity: {
		type: String,
		required: true
	},
	specifications: [{
		specificationDetail: {
			type: String,
			required: false
        },
        label: {
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

module.exports = ProcurementItemSchema