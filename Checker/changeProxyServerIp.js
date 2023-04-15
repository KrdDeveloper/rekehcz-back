const axios = require('axios'),
		e = process.env;

module.exports = async function  () {
		
	// rotate stripe proxy server ip
	const proxyServerIpChange = await axios.get(e.PROXY_CHANGE_IP_URL)

	console.info('proxyServerIpChange.data', proxyServerIpChange.data)

	// emits ip-change event, data can be ok or an error as well
	this.emit('ip-change', proxyServerIpChange.data)
}