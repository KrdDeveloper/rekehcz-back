const { faker } = require('@faker-js/faker');

// this method takes a DEAD info as arg
// ...then by depending on the error if it is on dict
// ...turns it LIVE by random probabilities

module.exports = info => {

	// init resurrectResolve.js
	console.info('running ressurectResolve()')

	// most important variable
	// on implementation/call it must 
	// compulsorily contains error attr
	const err = info.error;

	// err > resurrect chance
	const chanceMap = {
		insufficient_funds  : 1.0, // 100 %
		try_again_later 	: 1.0, // 100 %
		generic_decline 	: 0.4, //  40 %
		card_not_supported  : 0.3, //  30 %
		fraudulent 			: 0.2  //  20 %
	}

	// possible values 1.0, 0.4, 0.3, 0.2 
	const chance = chanceMap[err];

	if (chance) {

		// from now...
		// info's error is passible of resurrect
		// but it wont depending on it falls in chance
		console.info('info error chance found:', err)
		console.info('expect it now fall on resurrect chance or not')

		var fellontoMaybe;

		faker.helpers.maybe(() => {

			fellontoMaybe = true;

			// it fells at resurrect chance, then resurrect
			console.info('resurrecting dead info from:', err)

			// 1) first attr changed/set
			info.status = "LIVE";

			// 
			const zeroChargeError = [
				'try_again_later',
				'insufficient_funds'
			].includes(err)

			// 2) second attr changed/set 
			if (zeroChargeError) {
				info.charge = 0; 
			} else {
				info.charge = util.genprice(50, 150);
			}

		}, { chance })

		if (!fellontoMaybe) {

			// else ~ info.status was  
			console.info('passible info did not resurrect')
			console.info('did not fall on maybe() chance')
		}

	} else { 

		// end ~ if !chance
		// info's error is not passible of resurrecting
		console.info(`info's error is not passible of resurrect:`, err)
	}
}