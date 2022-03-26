const multer = require('multer');


// MULTER | FILE UPLOAD
let destinationPath = "api/public";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, destinationPath);
  },
  filename: async (req, file, cb) => {
    let removeSpaceFileName = file.originalname.toLocaleLowerCase().split(" ").join("-");
    const fileName = req.user._id + '_' + Date.now() + '_' + removeSpaceFileName;

    cb(null, fileName);
  }
})

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10000000,
  },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === "file") {
      if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true)
      }
      destinationPath = "api/public"; //reset
    }
  }
});

exports.setDestination = (folderName) => {
  return (req, res, next) => {
    destinationPath += folderName;
    next();
  }
}

exports.uploadFile = upload.single("file")