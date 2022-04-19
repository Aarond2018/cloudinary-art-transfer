import Cors from 'cors'
const cloudinary = require("cloudinary").v2;

cloudinary.config({
	cloud_name: "ddmm5ofs1",
	api_key: process.env.CLD_API_KEY,
	api_secret: process.env.CLD_API_SECRET,
	secure: true,
});

const cors = Cors({
  methods: ['GET', 'HEAD', 'POST'],
})

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default async function handler(req, res) {
	await runMiddleware(req, res, cors)
	
	try {
		const image = await cloudinary.uploader.upload(
			req.body.img, {
        folder: "art-transfer"
      },
			async function (error, result) {
        const response = await cloudinary.image(`${result.public_id}.jpg`, {
          sign_url: true,
          transformation: [
            { height: 700, width: 700, crop: "fill" },
            { overlay: req.body.tempId },
            { effect: "style_transfer", flags: "layer_apply" },
          ],
        });
        res.status(200).json(response);
			}
		);
	} catch (error) {
		res.json(error);
	}
}

export const config = {
	api: {
			bodyParser: {
					sizeLimit: '5mb'
			}
	}
}
