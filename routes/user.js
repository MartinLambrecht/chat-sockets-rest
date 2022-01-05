const { Router } = require("express");
const { check } = require("express-validator");

const {
	userGet,
	userPut,
	userPost,
	userDelete,
} = require("../controllers/user");

const {
	roleValidation,
	emailValidation,
	idValidation,
} = require("../helpers/db_validation");

const { validarCampos, hasRole, jwt_validation } = require("../middlewares");

// const { validarCampos } = require("../middlewares/field_validation");
// const { jwt_validation } = require("../middlewares/jwt_validation");
// const { hasRole } = require("../middlewares/role_validation");

const router = new Router();

router.get("/", userGet);
router.put(
	"/:id",
	check("id", "Invlid ID").isMongoId(),
	check("id").custom(idValidation),
	validarCampos,
	userPut
);
router.post(
	"/",
	[
		check("email", "The email has a wrong format.").isEmail(),
		check("email").custom(emailValidation),
		check("name", "Name is required").not().isEmpty(),
		check("email", "Email is required").not().isEmpty(),
		check("password", "Password is required").not().isEmpty(),
		check("password", "Password length must be more than 6.").isLength({
			min: 6,
		}),
		check("role").custom(roleValidation),
		validarCampos,
	],
	userPost
);
router.delete(
	"/:id",
	jwt_validation,
	hasRole("ADMIN_ROLE", "SALE_ROLE"),
	check("id", "Invlid ID").isMongoId(),
	check("id").custom(idValidation),
	validarCampos,
	userDelete
);

module.exports = router;
