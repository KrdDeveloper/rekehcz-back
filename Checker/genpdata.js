const { faker } = require('@faker-js/faker');

faker.setLocale('pt_BR')

module.exports = function () {
	
	let names = {
		firstName: faker.name.firstName(),
		lastName: faker.name.lastName()
	}

	return {
		...names,
			fullName: `${names.firstName} ${names.lastName}`,
			email: faker.internet.email(names.firstName, names.lastName).toLowerCase()
	}
}