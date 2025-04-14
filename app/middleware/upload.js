const multer = require('multer');
const path = require('path');

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
}).single('myfile');

function checkFileType(file, cb) {
    const filetypes = /pdf|txt/
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb('Error, only send( pdf,txt) file');
    }
}

module.exports = upload;