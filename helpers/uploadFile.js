const { v4: uuidv4 } = require("uuid");
const path = require("path");
const { request, response } = require("express");
const fs = require("fs");

const uploadFile = (file, validExtensions = ["pdf", "jpg"], folder = "") => {
	return new Promise((resolve, reject) => {
		//Validate the extension of the file
		if (!validateFileExtension(file, validExtensions)) {
			reject(
				`The extension is not allowed, please try with ${validExtensions.join(
					", "
				)}.`
			);
		}

		//Add unique ID to the name of the file
		const fileId = uuidv4();
		file.name = fileId + file.name;

		//Create directory to upload the file
		const uploadPath = path.join(__dirname, "../uploads", folder, file.name);
		//Move it into the uploadPath and send the response
		moveFileTo(file, uploadPath)
			.then((msg) => {
				resolve(msg);
			})
			.catch((err) => {
				reject(err);
			});
	});
};

const validateFileExtension = (file, validExtensions) => {
	const splittedName = file.name.split(".");
	const extension = splittedName.pop();
	return validExtensions.includes(extension);
};

const moveFileTo = (file, uploadPath) => {
	return new Promise((resolve, reject) => {
		file.mv(uploadPath, function (err) {
			if (err) {
				reject(err);
			}
			resolve(uploadPath);
		});
	});
};

const hasFiles = (req = request, res = response, next) => {
	if (!req.files || Object.keys(req.files).length === 0) {
		return res.status(400).json({ msg: "No file was uploaded." });
	}
	next();
};

const replaceFile = (model) => {
	fs.unlinkSync(model.img);
};

module.exports = {
	uploadFile,
	hasFiles,
	replaceFile,
};
