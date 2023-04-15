const axios = require('axios')

module.exports = async function (info) {
	
	let res = await axios.get(`https://bin-checker.net/api/${info.number}`),
			level = res.data.level,
				bank = res.data.bank.name
	
	return {
		level: level.length > 0 ? level : 'LEVEL?',
		bank: bank.replaceAll(' ', '').length > 0 ? bank : 'BANK?'
	}
}