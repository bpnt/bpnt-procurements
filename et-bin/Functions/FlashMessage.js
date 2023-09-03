'use strict'

/**
 * @file FlashMessage
 *
 * @description Flash Message for Status Message (Single Time Display)
 *
 * @author Jeevan Prakash Pant <jp@edtyro.com>
 * @version 1.0.0
 * @copyright Edtyro Private limited, 2020
 */

/**
 * Flash Message
 */
module.exports = () => {

	return (req, res, next) => {

		req.flash = _flash
		res.locals.getMessages = _getMessages(req)
		next()

	}

}

/**
 * @private
 * @function _flash
 *
 * @param {Object} prms
 * @param {String} prms.type type of parameter
 * @param {String} prms.msg message
 */
function _flash (prms) {

	if (this.session === undefined) throw Error('req.flash() requires sessions')
	const msgs = this.session.flash = this.session.flash || {}
	if (!prms.msg) {

		prms.msg = prms.type
		prms.type = 'info'

	}
	msgs[prms.type] = msgs[prms.type] || []
	if (Array.isArray(prms.msg)) {

		msgs[prms.type].push(...prms.msg)
		return

	}
	msgs[prms.type].push(prms.msg)

}

// Get all messages
function _getMessages (req) {

	return () => {

		if (req.session === undefined) throw Error('getMessages() requires sessions')
		const msgs = req.session.flash = req.session.flash || {}
		req.session.flash = {}
		return msgs

	}

}
