const Stripe = require('stripe'),
	  ProxyAgent = require('https-proxy-agent'),
	  Chance = require('chance'),
	  { faker } = require('@faker-js/faker'),
	  e = process.env;

const stripe = new Stripe(e.STRIPE_SK, { 
	maxNetworkRetries: 15,
})

async function stripeCharge (info) {
	
	try {

		let token = await this.makeToken(info),
				tokenid = token.token.id,
					receipt_email = token.receipt_email;

		console.info('tokenid', tokenid)
		console.info('receipt_email', receipt_email)
		
		// creates/launches charge from token above
		let charge = await stripe.charges.create({
		  amount: util.genprice(50, 150),
		  currency: 'brl',
		  source: tokenid,
		  description: 'Micro-service appliance',
		  receipt_email
		})

		info.charge = charge.amount
		info.status = 'LIVE'
		info.gateway = e.STRIPE_ACC
		info.date = new Date().toString()

		return info;

	} catch (error) {
		
		info.status = 'DEAD'
		info.gateway = e.STRIPE_ACC
		info.date = new Date().toString()
		info.error = error.decline_code || error.code || error.rawType || 'unkown';

		// console.error('error', error)
		console.error('info.error', info.error)

		return info;
	}

}

module.exports = stripeCharge;
