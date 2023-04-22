const e = process.env;

module.exports = async function (info) {

	const db = await this.mongoClient.db('rekehcz'),
		  collection = db.collection(`checks-${e.MODE}`);

	// check there is same cc already
	const filteredDocs = await collection.find({ 
		number: info.number 
	}).toArray();

	if (filteredDocs[0]) {
		return filteredDocs[0]
	}
}