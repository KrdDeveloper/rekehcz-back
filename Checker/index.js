const axios = require('axios'),
		EventEmitter = require('events'),
			{ MongoClient } = require('mongodb'),
				ccjs = require('creditcard.js')

const Card = require('creditcards/card'),
		ccard = Card(['visa']),
			expirity = require('creditcards/expiration');

var checkerEmitter = new EventEmitter(),
	e = process.env;

function Checker (infosTextArray) {

	this.mongoClient = new MongoClient(e.MONGO_STRING);
	this.mongoClient.connect()

	this.on = checkerEmitter.on
	this.emit = checkerEmitter.emit

	this.infos = infosTextArray.map(infoText => {
		
		let joined = infoText.split('|')

		let parsed = {
			number: joined[0],
			month: joined[1],
			year: joined[2],
			cvv: joined[3],
			brand: null,
			bank: null,
			level: null,
			charge: null,
			status: null,
			error: null
		}
		
		parsed.brand = ccjs.getCreditCardNameByNumber(parsed.number)

		console.info('parsed.number', parsed.number)
		console.info('parsed.brand', parsed.brand)

		const numvalid = ccard.luhn(parsed.number),
				expvalid = !expirity.isPast(parsed.month, parsed.year);
		
		if (!numvalid || !expvalid) {
			
			parsed.status = 'DEAD'

			if (numvalid) parsed.error = 'Invalid'
			if (expvalid) parsed.error = 'Expired'
		}

		return parsed;
	})

	this.storeCheck = require('./storeCheck.js')
	this.checkStored = require('./checkStored.js')
	this.makeToken = require('./makeToken.js')
	this.genpdata = require('./genpdata.js')
	this.startCheckLoop = require('./startCheckLoop.js');
}

Checker.prototype.getBinData = require('./getBinData.js')
Checker.prototype.stripeCharge = require('./stripeCharge.js')
Checker.prototype.changeProxyServerIp = require('./changeProxyServerIp.js')

module.exports = Checker;