const cloudinary = require("cloudinary").v2;

cloudinary.config({
	cloud_name: "ddmm5ofs1",
	api_key: process.env.CLD_API_KEY,
	api_secret: process.env.CLD_API_SECRET,
	secure: true,
});

export default async function handler(req, res) {
	const tempId = `${req.body.tempId.split("/")[1]}`;
	console.log(tempId);

	try {
		const cldRes = await cloudinary.image("public/passport.jpg", {
			transformation: [
				{ height: 700, width: 700, crop: "fill" },
				{ overlay: tempId },
				{ effect: "style_transfer", flags: "layer_apply" },
			],
		});

		/* const d = /'(.+)'/.exec(cldRes); */

		/* const cld = await cloudinary.uploader.upload("public/passport.jpg", function(error, result) {console.log(result, error)}); */

		res.status(200).json(cldRes);
	} catch (error) {
		/* res.json({message: "an error occured"}) */
		res.json(error);
	}
}
