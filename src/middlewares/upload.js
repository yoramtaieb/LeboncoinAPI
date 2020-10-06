const multer = require("multer");
const moment = require("moment");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

const storage = multer.diskStorage({
  destination: (request, file, callback) => {
    callback(null, "uploads");
  },
  filename: (request, file, callback) => {
    const [name] = file.originalname
      .replace(" ", "-")
      .substring(0, 19)
      .split(".");
    const date = moment().format("YYYY-MM-DD-HHmmss");
    const extension = MIME_TYPES[file.mimetype];
    callback(null, `${date}_${name}.${extension}`);
  },
});

module.exports = multer({ storage }).single("image");
