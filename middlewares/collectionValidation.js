const isAllowedCollection = (collection, allowedCollections) => {
	if (!allowedCollections) {
		throw new Error("No allowed collections, talk to an administrator");
	}
	if (!allowedCollections.includes(collection)) {
		throw new Error(
			`Unauthorized operation. ${collection} is not ${allowedCollections}`
		);
	}
	return true;
};

module.exports = { isAllowedCollection };
