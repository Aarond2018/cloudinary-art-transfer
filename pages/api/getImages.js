import Cors from 'cors';
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "ddmm5ofs1",
  api_key: process.env.CLD_API_KEY,
  api_secret: process.env.CLD_API_SECRET,
  secure: true,
});

const cors = Cors({
  methods: ['GET', 'HEAD'],
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
    const images = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'demo'
    }); 
    res.status(200).json(images.resources);
  } catch (error) {
    res.json({message: "an error occured"})
  }
}

