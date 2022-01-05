const { Router } = require("express");
const { check } = require("express-validator");
const {
	postFile,
	putCollectionFile,
	getCollectionFile,
	putCollectionFileCloudinary,
} = require("../controllers/uploads");
const { hasFiles } = require("../helpers/uploadFile");
const { validarCampos } = require("../middlewares");
const { isAllowedCollection } = require("../middlewares/collectionValidation");

const router = new Router();

router.post("/", hasFiles, postFile);

router.put(
	"/:collection/:id",
	[
		hasFiles,
		check("id", "Id is not a MongoID.").isMongoId(),
		check("collection").custom((collection) =>
			isAllowedCollection(collection, ["users", "products"])
		),
		validarCampos,
	]
	// putCollectionFileCloudinary
	// putCollectionFile
);

router.get(
	"/:collection/:id",
	[
		check("id", "Id is not a MongoID.").isMongoId(),
		check("collection").custom((collection) =>
			isAllowedCollection(collection, ["users", "products"])
		),
		validarCampos,
	],
	getCollectionFile
);

module.exports = router;
