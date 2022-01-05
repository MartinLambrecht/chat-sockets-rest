const { Category } = require("../models");
const { Role, User } = require("../models");
const Product = require("../models/product");

const roleValidation = async (role) => {
	const existsRole = await Role.findOne({ role });
	if (!existsRole) {
		throw new Error(`${role} is a invalid role.`);
	}
};
const emailValidation = async (email) => {
	const existsEmail = await User.findOne({ email });
	if (existsEmail) {
		throw new Error("El email ya se encuentra registrado");
	}
};
const idValidation = async (_id) => {
	const existsId = await User.findById(_id);
	if (!existsId) {
		throw new Error(`Not users with id:${_id}`);
	}
};

const categoryExists = async (id) => {
	const existsId = await Category.findById(id);

	if (!existsId) {
		throw new Error(`Category is not created.`);
	}
};

const productExists = async (id) => {
	const existsId = await Product.findById(id);

	if (!existsId) {
		throw new Error(`Product is not created.`);
	}
};

module.exports = {
	roleValidation,
	emailValidation,
	idValidation,
	categoryExists,
	productExists,
};
