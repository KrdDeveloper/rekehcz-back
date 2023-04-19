const Stripe = require('stripe'),
	  ProxyAgent = require('https-proxy-agent'),
	  Chance = require('chance'),
	  { faker } = require('@faker-js/faker'),
	  e = process.env;

var stripe = new Stripe(e.STRIPE_SK, {
	maxNetworkRetries: 15,
	httpAgent: new ProxyAgent(e.PROXY_URI)
})

async function stripeCharge (info) {
	
	try {
		
		const chance = new Chance(),
				name = chance.name({ prefix: true }),
					surname = chance.name({ middle: true }),
						fullname = name + ' ' + surname,
							username = faker.internet.userName(name, surname).toLowerCase(),
								email =  faker.internet.email(username).toLowerCase();

		console.info('username', username)
		console.info('email', email)
		
		// creates card token before charge
		let token = await stripe.tokens.create({
		  card: {
		    number: info.number,
		    exp_month: info.month,
		    exp_year: info.year,
		    cvc: info.cvv
		  }
		})

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
		info.error = error.decline_code || error.code || error.rawType || 'unkown';

		console.error('info.error', info.error)

		return info;

	}


}

module.exports = stripeCharge;
