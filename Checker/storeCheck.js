module.exports = async (info) => {
	
	const db = await this.mongoClient.db('rekehcz'),
		  collection = db.collection('checks')

	// check there is same cc already
	const filteredDocs = await collection.find({ 
		number: info.number 
	}).toArray();

	if (!filteredDocs[0]) {

		console.info(`Inserting info to checks collection: ${info.number}`)

		try {
			await collection.insertOne(info)
		} catch (error) {
			this.emit(
				'check-error', 
					error.toString(), 
						'Fail at this.storeCheck()')
		}
		
	} else {
		console.info(`info ${info.number} already on checks collection`)
	}
}