const Stripe = require('stripe'),
	  ProxyAgent = require('https-proxy-agent'),
	  Chance = require('chance'),
	  { faker } = require('@faker-js/faker'),
	  e = process.env;

// make stripe client at each call
var stripe = new Stripe(e.STRIPE_SK, {
	maxNetworkRetries: 15,
	httpAgent: new ProxyAgent(e.PROXY_URI, {
		headers: { 
			"Keep-Alive": "true",
			"User-Agent": faker.internet.userAgent() }
	})
})

async function stripeCharge (info) {
	
	try {
		
		info.charge = util.genprice(50, 150)
		info.status = 'LIVE'

		const chance = new Chance(),
				name = chance.name({ prefix: true }),
					surname = chance.name({ middle: true }),
						username = faker.internet.userName(name, surname)
							email =  faker.internet.email(usename);

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
		  amount: info.charge,
		  currency: 'brl',
		  source: token.id,
		  description: 'Micro-service appliance',
		  billing_details: {
		  	email,
    		name: name + ' ' + surname
		  }
		})

		this.emit('check', info);

	} catch (error) {
		
		info.status = 'DEAD'
		info.error = error.code

		this.emit('check', info)
	}


}

module.exports = stripeCharge;
