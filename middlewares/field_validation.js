const { validationResult } = require("express-validator");

const validarCampos = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ msg: errors });
	}
	next();
};

const nameToUpperCase = (req, res, next) => {
	req.body.name = req.body.name.toUpperCase();
	next();
};

module.exports = { validarCampos, nameToUpperCase };
