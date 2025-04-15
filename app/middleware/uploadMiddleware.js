const multer = require('multer');
const path = require('path');


const uploadMiddleware = {};

const storage = multer.diskStorage({
    destination: './uploadFile',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
})

//filter for uploading only .pdf and .txt file

const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('file');

function checkFileType(file, cb) {
    const filetypes = /pdf/
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb('Error, only send( pdf ) file');
    }
}


uploadMiddleware.uploadFile = () => async (req, res, next) => {
    await upload(req, res, (err) => {
        if (err) {
            console.log(err);
            return res.status(500).json(err.message);
        }
        if (!req.file) {
            return res.status(400).json(message.FILE_REQUIRED)
        }
        req.filePath = req.file;
        next();
    })
}
    
    
module.exports = uploadMiddleware;