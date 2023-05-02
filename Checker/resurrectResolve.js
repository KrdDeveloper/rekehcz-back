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
		insufficient_funds  	: 0.99, // 100 %
		try_again_later 		: 0.99, // 100 %
		do_not_honor			: 0.60,
		transaction_not_allowed : 0.99,
		invalid_account			: 0.7,
		generic_decline 		: 0.15, //  40 %
		card_not_supported  	: 0.5, //  30 %
		fraudulent 				: 0.0  //  0 %
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

			// dont know yet if makes sense
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

		}, { probability: chance })

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