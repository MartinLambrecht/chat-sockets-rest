const mongoose = require("mongoose");

const dbConnection = async () => {
	try {
		await mongoose.connect(process.env.MONGO_CNN);
		console.log("Database Up");
	} catch (error) {
		console.log(error);
		throw new Error("Error connecting to the database.");
	}
};

module.exports = {
	dbConnection,
};
