const jsonwebtoken = require("jsonwebtoken");
const User = require("../models/user");

const generarJWT = (uid) => {
	return new Promise((resolve, reject) => {
		const payload = { uid };
		jsonwebtoken.sign(
			payload,
			process.env.PRIVATE_KEY,
			{ expiresIn: "3h" },
			(err, token) => {
				if (err) {
					console.log(err);
					reject("Failure creating token.");
				} else {
					resolve(token);
				}
			}
		);
	});
};

const getUserFromJWT = async (token) => {
	if (token.length < 10) {
		return null;
	}
	const { uid } = jsonwebtoken.verify(token, process.env.PRIVATE_KEY);
	const user = await User.findById(uid);

	return user ? (user.state == true ? user : null) : null;
};

module.exports = { generarJWT, getUserFromJWT };
