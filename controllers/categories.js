const { request, response } = require("express");
const jwt = require("jsonwebtoken");
const { Category } = require("../models");
const mongoose = require("mongoose");

const categoriesGetAll = async (req = request, res = response, next) => {
	const { limit = "5", from = "0" } = req.query;
	const [results, categories] = await Promise.all([
		Category.countDocuments({ state: true }),
		Category.find({ state: true })
			.populate("user")
			.limit(parseInt(limit))
			.skip(parseInt(from)),
	]);
	res.status(200).json({ results, categories });
};

const categoriesGetOne = async (req = request, res = response, next) => {
	//Search for the category and data of the last user that modified this
	const category = await Category.findById(req.params.id).populate(
		"user",
		"name"
	);
	res.json(category);
};

const categoriesPost = async (req = request, res = response, next) => {
	const name = req.body.name.toUpperCase();

	const categoryDB = await Category.findOne({ name });
	//Validate Inexistens
	if (categoryDB) {
		return res
			.status(400)
			.json({ msg: `1Category ${name} is already created.` });
	}
	//Select data for the new Instance
	const data = { name, user: req.user._id };

	//Create Instance
	const category = new Category(data);
	//Save on DB
	await category.save();

	res.status(201).json({ msg: "POST - Categories", category });
};

const categoriesPut = async (req = request, res = response, next) => {
	let { state, user, ...data } = req.body;
	const { id } = req.params;
	//Search user that is doing the change
	const token = req.header("xToken");
	const { uid } = jwt.decode(token);
	const newUser = mongoose.Types.ObjectId(uid);
	//Update category
	data.user = newUser;
	const categoryResult = await Category.findByIdAndUpdate(id, data, {
		new: true,
	});
	//Populate Result
	const updatedCategory = await categoryResult.populate("user", "name");
	const as = req.user;
	res.json({ updatedCategory, as });
};

const categoriesDelete = async (req = request, res = response, next) => {
	const { id } = req.params;

	const token = req.header("xToken");
	const { uid } = jwt.decode(token);
	const newUser = mongoose.Types.ObjectId(uid);

	const categoryResult = await Category.findByIdAndUpdate(
		id,
		{
			state: false,
			user: newUser,
		},
		{ new: true }
	);
	if (!categoryResult) {
		return res.status(400).json({ msg: "Category not founded." });
	}
	const deletedCategory = await categoryResult.populate("user", "name");
	res.json({ deletedCategory });
};

module.exports = {
	categoriesGetAll,
	categoriesGetOne,
	categoriesPost,
	categoriesPut,
	categoriesDelete,
};
