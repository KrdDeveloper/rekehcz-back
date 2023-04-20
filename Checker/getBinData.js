const axios = require('axios')

module.exports = async function (info) {
	
	let res = await axios.get(`https://bin-checker.net/api/${info.number}`),
		brand = res.data.scheme,
		level = res.data.level,
		bank = res.data.bank.name
	
	return {
		brand,
		level: level.length > 0 ? level : 'LEVEL?',
		bank: bank.replaceAll(' ', '').length > 0 ? bank : 'BANK?'
	}
}