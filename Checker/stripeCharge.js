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

		const token = await this.makeToken(info)

		console.info('token.id', token.id)

		// creates/launches charge from token above
		let charge = await stripe.charges.create({
		  amount: util.genprice(50, 150),
		  currency: 'brl',
		  source: token.id,
		  description: 'Micro-service appliance'
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
