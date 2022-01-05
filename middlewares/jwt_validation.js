const { request } = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const jwt_validation = async (req = request, res, next) => {
	const token = req.header("xToken");
	if (!token) {
		return res.status(400).json({
			msg: "No token.",
		});
	}
	try {
		const { uid } = jwt.verify(token, process.env.PRIVATE_KEY);

		req.uid = uid;
		const [user] = await User.find({ _id: uid, state: true });
		if (user.length === 0) {
			return res.status(401).json({ msg: "No active user registered." });
		}
		req.user = user;
		next();
	} catch (error) {
		console.log(error);
		res.status(401).json({ msg: "Invalid token." });
	}
};

module.exports = { jwt_validation };
