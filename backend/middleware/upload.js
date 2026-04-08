const multer = require("multer");
const path = require("path");


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
        cb(null, "uploads/");
      // cb(null, "/home/rxchartsquare-nrislaw/htdocs/uploads");
    // cb(null, "/home/nodejs.blustor.net/htdocs/uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

module.exports = upload;

  