var fs = require("fs");
var cloudinary = require("cloudinary").v2;

cloudinary.config(process.env.CLOUDINARY_URL);

const cloudinaryFileUpload = async (file) => {
	const { tempFilePath } = file;
	const uploadResponse = await cloudinary.uploader
		.upload(tempFilePath)
		.catch((err) => {
			console.log(err);
		});
	return uploadResponse.secure_url;
};

const deleteCloudinaryFile = async (id) => {
	return await cloudinary.uploader.destroy(id).catch((err) => {
		console.log(err);
	});
};

module.exports = { cloudinaryFileUpload, deleteCloudinaryFile };
