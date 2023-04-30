const moment = require('moment'),
		e = process.env,
			deadline = Number(e.DEAD_LINE);

function Session (req) {
	
	this.routekey = global.state.routekey;
	this.remoteAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
	this.timeStart = moment()
	this.timeEnd = moment().add(deadline, 'minutes')
	this.remainingMinutes = getRemainingMinutes.call(this)

	setInterval(async () => {
		this.remainingMinutes = getRemainingMinutes.call(this)
	}, 1000)

	function getRemainingMinutes () {
	
		const now = moment(),
				duration = moment.duration(this.timeEnd.diff(now)),
					remainingMinutes = duration.asMinutes()

		return remainingMinutes;
	}
}

module.exports = Session;