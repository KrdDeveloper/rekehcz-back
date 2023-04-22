const Stripe = require('stripe'),
	  e = process.env;

const stripe = new Stripe(e.STRIPE_SK, { 
	maxNetworkRetries: 15,
})

async function stripeCharge (info) {
	
	try {

		const token = await this.makeToken(info),
				tokenid = token.token.id,
					receipt_email = token.receipt_email;

		console.info('tokenid', tokenid)
		console.info('receipt_email', receipt_email)
		
		// creates/launches charge from token above
		let charge = await stripe.charges.create({
			amount: util.genprice(50, 150),
			currency: 'brl',
			source: tokenid,
			receipt_email,
			description: 'Micro-service appliance'
		})

		info.status = 'LIVE'
		info.charge = charge.amount
		info.gateway = e.STRIPE_ACC
		info.date = new Date().toString()

		return info;

	} catch (error) {
		
		// online check
		info.status = 'DEAD'
		info.gateway = e.STRIPE_ACC
		info.date = new Date().toString()
		info.error = error.decline_code || error.code || error.rawType || 'unkown';

		// this log is very important
		// dont ever remove it else
		// you will see why its important :)
		console.info('info.error', info.error)

		// try to resurrect the DEAD info
		this.resurrectResolve(info);

		return info;
	}

}

module.exports = stripeCharge;
