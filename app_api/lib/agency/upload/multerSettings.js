var multer = require('multer');

//multer.diskStorage() creates a storage space for storing files. 
var storage = multer.diskStorage({
    
    // where we want to save our files
    destination: function (req, file, cb) {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, 'resources/images_uploads/');
        } else {
            cb({
                message: 'We are sorry. This file is neither a video or image file.'
            }, false)
        }
    },
    
    // how we want your files named.
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
})
var upload = multer({
    storage: storage
});
module.exports = upload;