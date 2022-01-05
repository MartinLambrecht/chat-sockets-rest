const { response, request } = require("express");
const bcryptjs = require("bcryptjs");

const User = require("../models/user");

const userGet = async (req, res = response) => {
	const { limit = "5", from = "0" } = req.query;
	const [results, users] = await Promise.all([
		User.countDocuments({ state: true }),
		User.find({ state: true }).limit(parseInt(limit)).skip(parseInt(from)),
	]);
	res.status(200).json({ results, users });
};

const userPut = async (req, res) => {
	const { id } = req.params;
	const { _id, google, password, ...rest } = req.body;

	if (password) {
		//Encriptar contraseña
		const salt = await bcryptjs.genSaltSync();
		rest.password = bcryptjs.hashSync(password, salt);
	}

	const user = await User.findByIdAndUpdate(id, rest);

	res.status(200).json({
		msg: "put API",
		user,
	});
};

const userPost = async (req = request, res) => {
	const { name, password, email, role } = req.body;

	const user = new User({ name, email, role });

	//Encriptar contraseña
	const salt = await bcryptjs.genSaltSync();
	user.password = bcryptjs.hashSync(password, salt);

	//Guardar datos
	await user.save();
	res.status(200).json({
		user,
	});
};

const userDelete = async (req, res) => {
	const { id } = req.params;

	const user = await User.findByIdAndUpdate(id, { state: false });

	res.status(403).json({ user });
};

module.exports = {
	userGet,
	userPut,
	userPost,
	userDelete,
};
