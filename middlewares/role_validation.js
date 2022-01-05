const { response, request } = require("express");

const isAdminValidation = (req = request, res = response, next) => {
	if (!req.user) {
		return res
			.status(500)
			.json({ msg: "Trying to validate role before the token." });
	}
	const { role, name } = req.user;
	if (role !== "ADMIN_ROLE") {
		return res
			.status(401)
			.json({ msg: `Unauthorized operation. ${name} is not ADMIN` });
	}
	next();
};

const hasRole = (...acceptedRoles) => {
	return (req = request, res = response, next) => {
		if (!req.user) {
			return res
				.status(500)
				.json({ msg: "Trying to validate role before the token." });
		}
		const { role, name } = req.user;
		if (!acceptedRoles.includes(role)) {
			return res.status(401).json({
				msg: `Unauthorized operation. ${name} is not ${acceptedRoles}`,
			});
		}

		next();
	};
};

module.exports = { isAdminValidation, hasRole };
