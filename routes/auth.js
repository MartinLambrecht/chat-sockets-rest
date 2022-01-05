const { Router } = require("express");
const { check } = require("express-validator");
const { authLogin, authGoogle, reNewToken } = require("../controllers/auth");

const { validarCampos } = require("../middlewares/field_validation");
const { jwt_validation } = require("../middlewares/jwt_validation");

const router = new Router();
router.get("", [jwt_validation, validarCampos], reNewToken);

router.post(
	"/login",
	[
		check("email", "No es un formato valido").isEmail(),
		check("password", "Password is required").not().isEmpty(),
		check("password", "Password length must be more than 6.").isLength({
			min: 6,
		}),
		validarCampos,
	],
	authLogin
);

router.post(
	"/google",
	check("id_token", "Id Token is neccesary.").not().isEmpty(),
	validarCampos,
	authGoogle
);

module.exports = router;
