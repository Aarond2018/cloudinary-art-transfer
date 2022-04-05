const cloudinary = require("cloudinary").v2;

cloudinary.config({
	cloud_name: "ddmm5ofs1",
	api_key: process.env.CLD_API_KEY,
	api_secret: process.env.CLD_API_SECRET,
	secure: true,
});

export default async function handler(req, res) {
	/* const tempId = `${req.body.tempId.split("/")[1]}`; */

	try {
		const image = await cloudinary.uploader.upload(
			req.body.img,{
        folder: "art-transfer"
      },
			async function (error, result) {	
        const response = await cloudinary.image(`${result.public_id}.jpg`, {
          transformation: [
            { height: 700, width: 700, crop: "fill" },
            { overlay: req.body.tempId },
            { effect: "style_transfer", flags: "layer_apply" },
          ],
        });
        res.status(200).json(response);
			}
		);

		/* const d = /'(.+)'/.exec(cldRes); */
	} catch (error) {
		res.json(error);
	}
}
