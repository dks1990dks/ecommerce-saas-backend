const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

exports.uploadImage = async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded"
      });
    }

    const streamUpload = () => {
      return new Promise((resolve, reject) => {

        const stream =
          cloudinary.uploader.upload_stream(
            {
              folder: "ecommerce-saas"
            },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            }
          );

        streamifier
          .createReadStream(req.file.buffer)
          .pipe(stream);
      });
    };

    const result = await streamUpload();

    res.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Upload failed"
    });
  }
};