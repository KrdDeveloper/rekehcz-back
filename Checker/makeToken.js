const Stripe = require('stripe'),
	  	request = require('request-promise'),
	  		ProxyAgent = require('https-proxy-agent'),
	  			{ faker } = require('@faker-js/faker'),
	  				e = process.env;

module.exports = async function (info) {

	const httpAgent = new ProxyAgent(e.PROXY_URI, {
		headers: {
			"User-Agent": faker.internet.userAgent(),
			"Accept-Encoding": "gzip, deflate, br",
			"Accept-Language": "pt-PT,pt-BR;q=0.9,en;q=0.8",
			"Device-Memory": faker.helpers.arrayElement(['8', '4', '2', '1', '3']),
			"Downlink": "4",
			"Dpr": "1.25",
			"Etc":"4g",
			"Referer": "https://www.google.com/",
			"Rtt": "150"
		}
	});
	
	const stripe = await new Stripe(e.STRIPE_PK, { 
		httpAgent,
		maxNetworkRetries: 15
	});

	let token = await stripe.tokens.create({
	  card: {
	    number: info.number,
	    exp_month: info.month,
	    exp_year: info.year,
	    cvc: info.cvv
	  }
	})

	return { token }
}