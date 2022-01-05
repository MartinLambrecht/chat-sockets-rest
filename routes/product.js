const { Router } = require("express");
const { check } = require("express-validator");

const {
	productGetAll,
	productGetOne,
	productPost,
	productPut,
	productDelete,
} = require("../controllers/product");
const { productExists, categoryExists } = require("../helpers/db_validation");
const {
	validarCampos,
	jwt_validation,
	hasRole,
	nameToUpperCase,
} = require("../middlewares");
const { categoryNameExists } = require("../middlewares/categoriesValidation");

const router = new Router();

// {{url}}/api/products

//Get all the Products - Public
router.get("/", [jwt_validation, validarCampos], productGetAll);

//Get one Product - Public
router.get(
	"/:id",
	[
		jwt_validation,
		check("id", "Invlid ID").isMongoId(),
		check("id").custom(productExists),
		validarCampos,
	],
	productGetOne
);

//Create a new Product - Private - Token Valido
router.post(
	"/",
	[
		jwt_validation,
		hasRole("ADMIN_ROLE", "SALE_ROLE"),
		check("name").not().isEmpty(),
		check("description").not().isEmpty(),
		check("price").isNumeric(),
		validarCampos,
		nameToUpperCase,
	],
	productPost
);

//Update one Product - Private - Token Valido
router.put(
	"/:id",
	[
		jwt_validation,
		hasRole("ADMIN_ROLE", "SALE_ROLE"),
		check("id", "Invlid ID").isMongoId(),
		check("id").custom(productExists),
		check("price", "Price required, insert 0 to not change it.").isNumeric(),
		validarCampos,
	],
	productPut
);

//Delete Product - Admin -
router.delete(
	"/:id",
	[
		jwt_validation,
		hasRole("ADMIN_ROLE"),
		check("id", "Invlid ID").isMongoId(),
		check("id").custom(productExists),
		validarCampos,
	],
	productDelete
);

module.exports = router;
