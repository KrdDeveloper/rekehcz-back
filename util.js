module.exports = {
	
	config () {

		global.util = Object.create(null);

		global.util.sleep = (milliseconds) => {

		  const date = Date.now();
		  
		  let currentDate = null;

		  do {
		    currentDate = Date.now();
		  } while (currentDate - date < milliseconds);
		  
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
	}
}