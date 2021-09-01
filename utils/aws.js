const AWS = require('aws-sdk');
const sharp = require('sharp');

const asyncHandler = require('./asyncHandler');
const AppError = require('./../utils/appError');

let awsS3;

const formatCredentials = (value) => {
    return value.replace(/[",]+/g,'')
}

awsS3 = new AWS.S3({
    accessKeyId: formatCredentials(process.env.AWS_ACCESS_KEY_ID),
    secretAccessKey: formatCredentials(process.env.AWS_SECRET_KEY),
});

exports.uploadImageToS3 = async (req, fileName, bucket, next) => {
    let uploadedImage;
    
    if(req.file){
        uploadedImage = await sharp(req.file.buffer);
    }else{
        uploadedImage = await sharp(req.files.image[0].buffer)
    }
    
    const params = {
        Bucket: bucket,
        Key: fileName,
        Body: uploadedImage
    }

    const result = await awsS3.upload(params).promise();

    if(!result) return next(new AppError("Error Uploading imaging", 400))
    return result;
}

exports.uploadBookToS3 = asyncHandler( async(req, fileName, bucket, next) => {
    const params = {
        Bucket: bucket,
        Key: fileName,
        Body: req.files.book[0].buffer
    }

    await awsS3.upload(params, (error, data) => {
        if(error){
            console.log(error)
        }
    })  
});


