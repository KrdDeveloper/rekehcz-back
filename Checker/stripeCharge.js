const Stripe = require('stripe'),
	  e = process.env;

async function stripeCharge (info) {
	
	const stripe = new Stripe(e.STRIPE_SK2, { 
		maxNetworkRetries: 15,
		timeout: 3000
	})

	const pdata = this.genpdata();

	try {

		const token = await this.makeToken(info),
			  tokenid = token.token.id  

		console.info('tokenid', tokenid)
		
		// creates/launches charge from token above
		let charge = await stripe.charges.create({
			amount: util.genprice(50, 150),
			currency: 'brl',
			source: tokenid,
			description: 'Micro-service appliance'
		})

		info.status = 'LIVE'
		info.charge = charge.amount
		info.gateway = e.STRIPE_ACC
		info.date = new Date().toString()

		// inserts pdata embded with info
		Object.assign(info, pdata)

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
		console.info('stripe native Charge error (resolving as normal check)')
		console.info('info.error', info.error)

		// try to resurrect the DEAD info
		this.resurrectResolve(info);

		// inserts pdata embded with info
		if (info.status === "LIVE") {
			Object.assign(info, pdata)
		}

		return info;
	}

}

module.exports = stripeCharge;
