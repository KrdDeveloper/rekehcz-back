const Chance = require('chance'),
	  { faker } = require('@faker-js/faker');

faker.setLocale('pt_BR')

module.exports = function () {

	const chance = new Chance()
	
	let names = {
		firstName: faker.name.firstName(),
		lastName: faker.name.lastName()
	}

	let birth = `${util.pad(chance.integer({ min: 1, max: 29 }), 2)}/${util.pad(chance.integer({ min: 1, max: 12 }), 2)}/${chance.integer({ min: 1975, max: 1999 })}`

	return {
		...names,
			fullName: `${names.firstName} ${names.lastName}`,
				cpf: chance.cpf(),
					birth
	}
}