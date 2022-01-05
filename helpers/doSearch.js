const { User, Category, Role } = require("../models");
const Product = require("../models/product");

const doUsersSearch = async (name) => {
	const regExp = new RegExp(name, "i");
	return User.find({ $and: [{ name: regExp }, { state: true }] });
};
const doCategoriesSearch = async (name) => {
	const regExp = new RegExp(name, "i");
	return Category.find({ $and: [{ name: regExp }, { state: true }] });
};
const doProductsSearch = async (name) => {
	const regExp = new RegExp(name, "i");
	return Product.find({ $and: [{ name: regExp }, { state: true }] });
};
const doRolesSearch = async (name) => {
	const regExp = new RegExp(name, "i");
	return Role.find({ $and: [{ role: regExp }, { state: true }] });
};
module.exports = {
	doUsersSearch,
	doCategoriesSearch,
	doProductsSearch,
	doRolesSearch,
};
