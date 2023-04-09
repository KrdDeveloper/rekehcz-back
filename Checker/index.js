const axios = require('axios'),
		EventEmitter = require('events'),
			ccjs = require('creditcard.js');

const getBinData = require('./getBinData.js'),
		stripeCharge = require('./stripeCharge.js');

var checkerEmitter = new EventEmitter(),
	e = process.env;

function Checker (infosTextArray) {

	console.log('infosTextArray', infosTextArray)

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

		const numvalid = ccjs.isValid(parsed.number),
				expvalid = ccjs.isExpirationDateValid(parsed.month, parsed.year),
					cvvalid = ccjs.isSecurityCodeValid(parsed.number, parsed.cvv);
		
		if (!numvalid || !expvalid || !cvvalid) {
			parsed.status = 'DEAD'
			parsed.error = 'Invalid'
		}

		return parsed;
	})

	console.log(this.infos)

	this.start = async () => {

		for (const info of this.infos) {

			await fetch(e.PROXY_CHANGE_IP_URL)

			sleep(12000)
			
			if (info.status === 'DEAD') {
				
				await this.emit('check', info)
			
			} else {

				try {
					
					let binData = await getBinData(info)
					
					info.bank = binData.bank
					info.level = binData.level	

				} catch (error) {
					
					console.log('Fail at getBinData() in start()')
					console.error(error);
					
					this.emit('check-error', error.toString())
				}

				try {
						
					await stripeCharge(info)

					info.charge = '0.50'
					info.status = 'LIVE'

					// finally
					await this.emit('check', info);
				
				} catch (error) {
					
					console.log('Fail at stripeCharge() in start()')
					console.error(error);
					
					this.emit('check-error', error.toString())
				}
			}

			// if is the last info checked
			if (info.number === this.infos[this.infos.length - 1].number) {
				await this.emit('stop')
			}
		}
	}
}

module.exports = Checker;