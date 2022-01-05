const { response, request } = require("express");
const bcryptjs = require("bcryptjs");

const { generarJWT } = require("../helpers/tokens");
const User = require("../models/user");
const { googleVerify } = require("../helpers/google_verify");

const authLogin = async (req = request, res = response) => {
	const { password, email } = req.body;
	try {
		//Verificar email
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({ msg: "Unregistered email." });
		}
		//Verificar activo
		if (!user.state) {
			return res.status(400).json({ msg: "Inactive Account." });
		}
		//Coincide contraseña
		const validPassword = bcryptjs.compareSync(password, user.password);
		if (!validPassword) {
			return res.status(400).json({
				msg: "Usuario / Password no son correctos - password",
			});
		}
		//Generate JWT
		const token = await generarJWT(user.id);
		return res.status(200).json({ user, token });
	} catch (error) {
		console.log(error);
		res.status(500).json({ msg: "Invalid password/email." });
	}
};

const authGoogle = async (req, res, next) => {
	const { id_token } = req.body;
	try {
		const googleUser = await googleVerify(id_token);
		const { picture, name, email } = googleUser;
		let user = await User.findOne({ email });
		if (!user) {
			//crear usuario
			const data = {
				name,
				email,
				password: "<3",
				picture,
				googleSignUp: true,
				role: "USER_ROLE",
			};
			user = new User(data);
			await user.save();
		}

		//Ingresar con los datos
		//Reject if state false in DB
		if (!user.state) {
			return res
				.status(401)
				.json({ msg: "Blocked Account, talk to an administrator." });
		}
		//Generar Token de JWT
		const token = await generarJWT(user.id);
		return res.status(200).json({
			user,
			token,
		});
	} catch (error) {
		console.log(error);
		res.status(400).json({ msg: "Unverified google token" });
	}
};

const reNewToken = async (req, res, next) => {
	const { user } = req;
	const token = await generarJWT(user.id);
	user.token = token;
	return res.status(200).json({ user, token });
};

module.exports = { authLogin, authGoogle, reNewToken };
