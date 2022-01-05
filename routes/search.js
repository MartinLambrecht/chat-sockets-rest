const { Router } = require("express");
const { check } = require("express-validator");
const { searchGet } = require("../controllers/search");
const { jwt_validation, hasRole, validarCampos } = require("../middlewares");

const router = new Router();

router.get(
	"/:collection/:name",
	[jwt_validation, hasRole("ADMIN_ROLE", "SALE_ROLE"), validarCampos],
	searchGet
);

module.exports = router;
