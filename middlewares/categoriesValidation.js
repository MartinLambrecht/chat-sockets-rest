const { Category } = require("../models");

const categoryNameExists = async (name) => {
	const categoryWithName = await Category.findOne({ name });
	if (categoryWithName != null) {
		throw new Error(`${name} already exists.`);
	}
};

module.exports = { categoryNameExists };
