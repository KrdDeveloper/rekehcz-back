const axios = require('axios'),
		EventEmitter = require('events'),
			Stripe = require('stripe'),
				cc = require('creditcard.js');

var checkerEmitter = new EventEmitter(),
		stripe = new Stripe('MYPSK'),
			e = process.env;

function Checker (infosTextArray) {

	this.on = checkerEmitter.on
	this.emit = checkerEmitter.emit
	
	this.infos = infosTextArray.map((infoText) => {
		
		let joined = infoText.join('|')
		
		return {
			number: joined[0],
			month: joined[1],
			year: joined[2],
			cvv: joined[3]
		}
	})

	this.parseInfo = (info, binData, charge) => {

		if (!cc.isValid(info.number)) {
			info.status = 'dead'
		} else {

		}

		return info;
	}

	this.getBinData = async (infoNumber) => {

	}

	this.check = async (info) => {

		// 
		let isValid = this.validate(info),
			binData;

		if (isValid) {
			
			try {
				binData = await this.getBinData(info)
			} catch (err) {
				console.log('Fail at getBinData at check()')
				console.error(err)
			}

		} else { 

			info.dead = true
			this.emit('check', parseInfo(info))
		}
		
		try {
			
			let proxyIpChange = await axios.get('http://proxidize.io:23454/change_ip')	
			
			console.log('proxyIpChange', proxyIpChange)

			try {

				let stripeCharge = await stripe.charge({
					// attrs fill
				})

				console.log('stripeCharge', stripeCharge)

				this.emit('check', s)

			} catch(err) {
				console.log('Fail at stripe charge ip at check()')
				console.error(err);
			}
			
		} catch(err) {
			console.log('Fail at changing proxy ip at check()')
			console.error(err);
		}
		
	}
}

module.exports = Checker;