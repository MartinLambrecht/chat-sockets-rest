const {
	doUsersSearch,
	doCategoriesSearch,
	doProductsSearch,
	doRolesSearch,
} = require("../helpers/doSearch");

const validCollections = ["users", "categories", "products", "roles"];

const searchGet = async (req, res, next) => {
	const { collection, name } = req.params;
	if (!validCollections.includes(collection)) {
		return res.status(400).json({ msg: "Not a valid collection." });
	}
	let results;
	switch (collection) {
		case "users":
			results = await doUsersSearch(name);
			break;
		case "categories":
			results = await doCategoriesSearch(name);
			break;
		case "products":
			results = await doProductsSearch(name);
			break;
		case "roles":
			results = await doRolesSearch(name);
			break;
		default:
			return res
				.status(400)
				.json({ msg: "Forgotted to add this route, notice server" });
	}
	res.json(results);
};

module.exports = { searchGet };
