const { request, response } = require("express");
const { save } = require("mongoose");
const fs = require("fs");
const path = require("path");

const { uploadFile, replaceFile } = require("../helpers/uploadFile");
const Product = require("../models/product");
const User = require("../models/user");
const {
	cloudinaryFileUpload,
	deleteCloudinaryFile,
} = require("../helpers/cloudinary");

const postFile = async (req, res, next) => {
	await uploadFile(req.files.file, undefined, "img")
		.then((finalPath) => {
			return res.json({ finalPath });
		})
		.catch((error) => {
			return res.status(400).json({ error });
		});
};

const putCollectionFile = async (req = request, res) => {
	const { collection, id } = req.params;
	const { img } = req.files;

	//Set the model of the selected collection
	let model;

	switch (collection) {
		case "users":
			model = User;
			break;
		case "products":
			model = Product;
			break;
		default:
			return res
				.status(500)
				.json({ msg: "Forgotten to validate this option." });
	}

	//Search the object with ID
	let searchResult = await model.findById(id);

	if (!searchResult) {
		return res.status(400).json({ msg: `${id} doesn´t have any match.` });
	}

	//Erase img if exists
	if (fs.existsSync(searchResult.img)) {
		replaceFile(searchResult);
	}

	//Move the photo and sopy the route to the img property
	searchResult.img = await uploadFile(req.files.img, ["png"], collection);
	//Save changes
	await searchResult.save();

	res.json({ msg: "Put - Upload", searchResult });
};

const putCollectionFileCloudinary = async (req = request, res) => {
	const { collection, id } = req.params;
	const { img } = req.files;

	//Set the model of the selected collection
	let model;

	switch (collection) {
		case "users":
			model = User;
			break;
		case "products":
			model = Product;
			break;
		default:
			return res
				.status(500)
				.json({ msg: "Forgotten to validate this option." });
	}

	//Search the object with ID
	let searchResult = await model.findById(id);

	if (!searchResult) {
		return res.status(400).json({ msg: `${id} doesn´t have any match.` });
	}

	//Erase img if exists
	if (searchResult.img) {
		const splittedUrl = searchResult.img.split("/");
		const idWithExtension = splittedUrl.pop();
		const [public_id] = idWithExtension.split(".");
		console.log(public_id);
		await deleteCloudinaryFile(public_id);
	}

	//Move the photo and sopy the route to the img property
	searchResult.img = await cloudinaryFileUpload(img);
	//Save changes
	await searchResult.save();

	res.json({ msg: "Put - Upload", searchResult });
};

const getCollectionFile = async (req, res = response, next) => {
	const { collection, id } = req.params;

	//Set the model of the selected collection
	let model;

	switch (collection) {
		case "users":
			model = User;
			break;
		case "products":
			model = Product;
			break;
		default:
			return res
				.status(500)
				.json({ msg: "Forgotten to validate this option." });
	}

	//Search the object with ID
	let searchResult = await model.findById(id);

	if (!searchResult) {
		return res.status(400).json({ msg: `${id} doesn´t have any match.` });
	}

	//Return img if exists
	if (fs.existsSync(searchResult.img)) {
		return res.sendFile(searchResult.img);
	}

	res.sendFile(path.join(__dirname, "../assets/no-image.jpg"));
};

module.exports = {
	postFile,
	putCollectionFile,
	getCollectionFile,
	putCollectionFileCloudinary,
};
