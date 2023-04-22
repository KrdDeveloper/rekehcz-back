const Stripe = require('stripe'),
	  request = require('request-promise'),
	  ProxyAgent = require('https-proxy-agent'),
	  { faker } = require('@faker-js/faker'),
	  e = process.env;

module.exports = async function (info) {

	const proxyAgent = new ProxyAgent(e.PROXY_URI, {
		headers: {
			"User-Agent": faker.internet.userAgent(),
			"Accept-Encoding": "gzip, deflate, br",
			"Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8",
			"Device-Memory": faker.helpers.arrayElement(['8', '4', '2', '1', '3']),
			"Downlink": "4",
			"Dpr": "1.25",
			"Etc":"4g",
			"Referer": "https://www.google.com/",
			"Rtt": "150",
			"Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
		}
	});
	
	const stripe = await new Stripe(e.STRIPE_PK, { 
		maxNetworkRetries: 15
	});

	const pdata = this.genpdata();

	console.info('pdata.email', pdata.email)
	console.info('pdata.fullName', pdata.fullName)
			
	let token = await stripe.tokens.create({
	  card: {
	    number: info.number,
	    exp_month: info.month,
	    exp_year: info.year,
	    cvc: info.cvv,
	    name: pdata.fullName,
	    address_country: 'BR'
	  }
	})

	return { 
		token, 
		receipt_email: pdata.email 
	}
}