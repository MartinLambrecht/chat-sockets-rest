const { request, response } = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Product = require("../models/product");
const Category = require("../models/category");
const { categoryExists } = require("../helpers/db_validation");

const productGetAll = async (req = request, res = response, next) => {
	const { limit = "5", from = "0" } = req.query;
	const [results, products] = await Promise.all([
		Product.countDocuments({ state: true }),
		Product.find({ state: true })
			.populate("user category", "name user")
			.limit(parseInt(limit))
			.skip(parseInt(from)),
	]);
	res.status(200).json({ results, products });
};

const productGetOne = async (req = request, res = response, next) => {
	//Search for the product and data of the last user that modified this
	const product = await Product.findById(req.params.id).populate(
		"user category",
		"name"
	);
	res.json({ msg: "GET - Product", product });
};

const productPost = async (req = request, res = response, next) => {
	const { name, category, description, price } = req.body;
	const categoryName = category.toUpperCase();

	const productDB = await Product.findOne({ name });
	//Validate Inexistens
	if (productDB) {
		return res.status(400).json({ msg: `Product ${name} is already created.` });
	}
	//Search Category
	const categoryDB = await Category.findOne({
		name: categoryName,
		state: true,
	});
	if (!categoryDB) {
		return res.status(200).json({ msg: `Category ${category} is not valid.` });
	}
	//Select data for the new Instance
	const data = {
		name,
		description,
		price,
		user: req.user._id,
		category: categoryDB._id,
	};

	//Create Instance
	const product = new Product(data);
	//Save on DB
	await product.save();

	res.status(201).json({ msg: "POST - Product", product });
};

const productPut = async (req = request, res = response, next) => {
	//Destructurate request
	let { state, user, name, _id, category, price, ...data } = req.body;
	const { id } = req.params;

	//Set the new data for the product
	if (price > 0) data.price = price;
	data.user = req.user._id;
	if (category) {
		const upperCaseCategory = category.toUpperCase();
		const categoryDB = await Category.findOne({
			name: upperCaseCategory,
			state: true,
		});
		if (categoryDB) data.category = categoryDB._id;
	}

	//Update product
	const productResult = await Product.findByIdAndUpdate(id, data, {
		new: true,
	});

	//Populate Result
	const updatedProduct = await productResult.populate("user category", "name");

	//Send response
	res.json({ msg: "PUT - Product", updatedProduct });
};

const productDelete = async (req = request, res = response, next) => {
	const { id } = req.params;

	const productResult = await Product.findByIdAndUpdate(
		id,
		{
			state: false,
			user: req.user._id,
		},
		{ new: true }
	);
	const deletedProduct = await productResult.populate("user category", "name");
	res.json({ msg: "DELETE - Product", deletedProduct });
};

module.exports = {
	productGetAll,
	productGetOne,
	productPost,
	productPut,
	productDelete,
};
