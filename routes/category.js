const { Router } = require("express");
const { check } = require("express-validator");
const {
	categoriesGetOne,
	categoriesGetAll,
	categoriesPost,
	categoriesPut,
	categoriesDelete,
} = require("../controllers/categories");
const { categoryExists } = require("../helpers/db_validation");

const {
	jwt_validation,
	hasRole,
	validarCampos,
	nameToUpperCase,
} = require("../middlewares");
const { categoryNameExists } = require("../middlewares/categoriesValidation");

const router = new Router();

// {{url}}/api/categories

//Get all the categories - Public
router.get("/", [validarCampos], categoriesGetAll);

//Get one category - Public
router.get(
	"/:id",
	[
		check("id", "Invlid ID").isMongoId(),
		check("id").custom(categoryExists),
		validarCampos,
	],
	categoriesGetOne
);

//Create a new Category - Private - Token Valido
router.post(
	"/",
	[jwt_validation, check("name").not().isEmpty(), validarCampos],
	categoriesPost
);

//Update one Category - Private - Token Valido
router.put(
	"/:id",
	[
		jwt_validation,
		hasRole("ADMIN_ROLE", "SALE_ROLE"),
		check("id", "Invlid ID").isMongoId(),
		check("name").not().isEmpty(),
		check("id").custom(categoryExists),
		validarCampos,
		nameToUpperCase,
		check("name").custom(categoryNameExists),
		validarCampos,
	],

	categoriesPut
);

//Delete Category - Admin -
router.delete(
	"/:id",
	[
		check("id", "Invlid ID").isMongoId(),
		jwt_validation,
		check("id").custom(categoryExists),
		hasRole("ADMIN_ROLE"),
		validarCampos,
	],
	categoriesDelete
);

module.exports = router;
