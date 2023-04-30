const axios = require('axios'),
		e = process.env;

module.exports = async function  () {
		
	console.info('e.PROXY_CHANGE_IP_URL', e.PROXY_CHANGE_IP_URL)

	// rotate stripe proxy server ip
	const proxyServerIpChange = await axios.get(e.PROXY_CHANGE_IP_URL)

	console.info('proxyServerIpChange.data', proxyServerIpChange.data)
}