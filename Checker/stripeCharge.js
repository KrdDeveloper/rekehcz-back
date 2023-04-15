const Stripe = require('stripe'),
	  axios = require('axios'),
	  ProxyAgent = require('https-proxy-agent'),
	  e = process.env;

async function stripeCharge (info) {

	info.charge = util.genprice(50, 150)
	info.status = 'LIVE'

	// make stripe client at each call
	let stripe = new Stripe(e.STRIPE_SK, {
		maxNetworkRetries: 15,
		httpAgent: new ProxyAgent(e.PROXY_URI)
	})
	
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
	})

	if (charge) {
		this.emit('check', info);
	}
}

module.exports = stripeCharge;
