/**
 * @file Slugify
 *
 * @description Generate Slug
 *
 * @author Jeevan Prakash Pant <jp@edtyro.com>
 * @version 1.0.0
 * @copyright Edtyro Private Limited, 2020
 */
'use strict'

/**
 * Slugify
 *
 * @param {Object} param - Size fo desired reference
 * @param {String} param.model - Model's model whose slug needs to be generated
 * @param {String} param.type - Type of slug that needs to be generated
 *
 * @returns {String} - SmallAlphanumericDassed String
 */
module.exports = async (param) => {

	if (typeof param.type !== 'undefined' && param.type) {

		// TODO: various types of slug

	} else { // default case

		// Primitive Declaration
		var preSlug = _generateSlug(param.slug)
		var found = false
		var counter = 1

		// slug validation
		var item = await param.model.findOne({ slug: preSlug })

		if (item) {

			while (!found) {

				var slug = preSlug + '-' + counter

				item = await param.model.findOne({ slug: slug })

				if (!item) {

					found = true

				} else {

					counter = counter + 1

				}

			}

			return slug

		} else {

			return preSlug

		}

	}

}

/**
 * slugify
 *
 * @param {String } - raw string
 *
 * @returns { String } - slugified sring
 */
function _generateSlug (string) {

	const a = 'àáäâãåèéëêìíïîòóöôùúüûñçßÿœæŕśńṕẃǵǹḿǘẍźḧ·/_,:;'
	const b = 'aaaaaaeeeeiiiioooouuuuncsyoarsnpwgnmuxzh------'
	const p = new RegExp(a.split('').join('|'), 'g')

	return string.toString().toLowerCase()
		.replace(/\s+/g, '-') // Replace spaces with
		.replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
		.replace(/&/g, '-and-') // Replace & with ‘and’
		// eslint-disable-next-line no-useless-escape
		.replace(/[^\w\-]+/g, '') // Remove all non-word characters
		// eslint-disable-next-line no-useless-escape
		.replace(/\-\-+/g, '-') // Replace multiple — with single -
		.replace(/^-+/, '') // Trim — from start of text .replace(/-+$/, '') // Trim — from end of text

}
