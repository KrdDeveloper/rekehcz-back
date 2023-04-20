const axios = require('axios')

module.exports = async function (info) {
	
	let res = await axios.get(`https://bin-checker.net/api/${info.number}`),
			level = res.data.level || "unknown",
				bank = res.data.bank.name.replaceAll(" ", '')  || "unknown";
	
	return { level, bank }
}