const Stripe = require('stripe'),
	  axios = require('axios'),
	  ProxyAgent = require('https-proxy-agent'),
	  e = process.env;

async function stripeCharge (info, cb) {

	let stripe = new Stripe(e.STRIPE_SK, {
		maxNetworkRetries: 15,
		httpAgent: new ProxyAgent(e.PROXY_URI, { headers: { 'Keep-Alive': true } })
	})

	// creates card token before charge
	const token = await stripe.tokens.create({
	  card: {
	    number: info.number,
	    exp_month: info.month,
	    exp_year: info.year,
	    cvc: info.cvv,
	  }
	})

	// creates/launches charge from token above
	const charge = await stripe.charges.create({
	  amount: 50,
	  currency: 'brl',
	  source: token.id,
	  description: 'Micro-service appliance',
	})
}

module.exports = stripeCharge;
