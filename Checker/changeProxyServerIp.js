const axios = require('axios'),
		axiosRetry = require('axios-retry'),
			e = process.env;

axiosRetry(axios, {
    
    retries: 3,
    
    retryDelay: (retryCount) => {
        console.log(`retry attempt: ${retryCount}`);
        return retryCount * 2000; // time interval between retries
    },
    
    retryCondition: (error) => {
        // if retry condition is not specified, by default idempotent requests are retried
        return error.response.status === 503;
    },
})

module.exports = async function  () {
		
	console.info('e.PROXY_CHANGE_IP_URL', e.PROXY_CHANGE_IP_URL)

	// rotate stripe proxy server ip
	const proxyServerIpChange = await axios.get(e.PROXY_CHANGE_IP_URL)

	console.info('proxyServerIpChange.data', proxyServerIpChange.data)
}