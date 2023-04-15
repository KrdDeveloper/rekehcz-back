const axios = require('axios'),
		EventEmitter = require('events'),
			{ MongoClient } = require('mongodb'),
				ccjs = require('creditcard.js');

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

		if (parsed.brand === 'Mastercard') {
			parsed.brand = 'Master'
		}

		const numvalid = ccjs.isValid(parsed.number),
				expvalid = ccjs.isExpirationDateValid(parsed.month, parsed.year),
					cvvalid = ccjs.isSecurityCodeValid(parsed.number, parsed.cvv);
		
		if (!numvalid || !expvalid || !cvvalid) {
			parsed.status = 'DEAD'
			parsed.error = 'Invalid'
		}

		return parsed;
	})

	this.storeCheck = require('./storeCheck.js')
	this.checkStored = require('./checkStored.js')
	this.startCheckLoop = require('./startCheckLoop.js');
}

Checker.prototype.getBinData = require('./getBinData.js')
Checker.prototype.stripeCharge = require('./stripeCharge.js')
Checker.prototype.changeProxyServerIp = require('./changeProxyServerIp.js')

module.exports = Checker;