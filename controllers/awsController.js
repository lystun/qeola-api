//import multer for handling multipart form-data
const multer = require('multer');

//import the function to opload the file(s) to AWS S3 buvket
const { uploadImageToS3, uploadFileToS3 } = require('./../utils/aws');

//import error handler an extention of the default Error class
const AppError = require('./../utils/appError');

//temporarily store file into memory
const multerStorage = multer.memoryStorage()

//filter the file for any inappropriateness
const multerFilter = (req, file, cb) => {
    
    if(file.size > process.env.MAX_FILE_UPLOAD ){
        cb(new AppError(`Please update files with sizes less that 5mb`, 400), false)
    }

    if(file.mimetype.startsWith('image') || file.mimetype.startsWith('application/pdf') ){
        cb(null, true)
    }else {
        cb(new AppError('Please upload relevant files! Images or PDFs!', 400), false)
    }
}

//define the multer options
const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
})

//handle single image and upload
exports.handleImageFromClient = upload.single('image');
exports.handleFileFromClient = upload.single('briefFile');

//upload image.
exports.uploadImage = async(req, fileName, bucket, next) => {
    const result = await uploadImageToS3(req, fileName, bucket)
    return result
}

exports.uploadFile = async(req, fileName, bucket, next) => {
    const result = await uploadFileToS3(req, fileName, bucket);
    return result
}



