const Chance = require("chance")

module.exports = {
	
	config () {

		const chance = new Chance()

		global.util = Object.create(null);

		global.util.sleep = () => {

		  const milliseconds = 19000

		  const date = Date.now();
		  
		  let currentDate = null;

		  do {
		    currentDate = Date.now();
		  } while (currentDate - date < milliseconds);
		  
		}

		global.util.timeout = function timeout(ms) {
		    return new Promise(resolve => setTimeout(resolve, ms));
		} 

		global.util.genprice = (from, to) => {
			return Math.floor(Math.random() * to) + from;
		} 

		global.util.genkey = () => {
			return Math.random().toString(36).slice(2, 21);
		}

		global.util.genid = () => {
			return Math.random().toString(36).slice(2, 7);
		}

		global.util.pad = (num, size) => {
		    num = num.toString();
		    while (num.length < size) num = "0" + num;
		    return num;
		}
	}
}