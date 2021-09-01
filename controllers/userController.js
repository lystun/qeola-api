const { promisify } = require('util')
const jwt = require('jsonwebtoken');

const User = require('./../models/userModel');

const AppError = require('./../utils/appError');
const crudHandler = require('./crudHandler');
const asyncHandler = require('../utils/asyncHandler');

const multer = require('multer'); 
const aws = require('./../utils/aws');

const multerStorage = multer.memoryStorage()

const multerFilter = (req, file, cb) => {
    if(file.mimetype.startsWith('image')){
        cb(null, true)
    }else {
        cb(new AppError('Not an Image! Please upload only images', 400), false)
    }
}

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
})

exports.handleImageFromClient = upload.single('image')

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};

    Object.keys(obj).forEach(el => {
        if(allowedFields.includes(el)) newObj[el] = obj[el];
    });

    return newObj
}

//update user
exports.updateMe = asyncHandler (async (req, res, next) => {
    //1. Throw an error if user tries to update password data
    if(req.body.password || req.body.passwordConfirm ){
        return next(new AppError('This route is not for password updates', 400))
    }

    //filter out unwanted fields before updating in the databse
    const filteredBody = filterObj(req.body, 'name', 'image', 'gender', 'phone', 'country' );

    if(req.file){
        const fileImageName = `users-${Date.now()}.jpeg`;
        filteredBody.image = process.env.AWS_URL+'/users/'+fileImageName;
        aws.uploadImageToS3(req, fileImageName, 'the-soul-clinic/users', next)
    }

    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true
    })
    
    // update user document
    res.status(200).json({
        status: 'success',
        data : {
            user: updatedUser,
        }
    });

});

exports.deleteMe = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user.id, { active: false })

    res.status(204).json({
        status: "success",
        data: null
    })
})

exports.getMe = asyncHandler(async(req, res, next) => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1]
    }
    
    if(!token){
        return next(new AppError("You're not logged in. Please log in.", 401));
    };
    
    //2.verify the token
    const decoded = await promisify(jwt.verify) (token, process.env.JWT_SECRET)
    
    //3.check if user still exists
    const me = await User.findById(decoded.id)

    res.status(200).json({
        status: 'success',
        data: {
            me
        }
    })
});

exports.getUserByEmail = asyncHandler (async (req, res, next) => {
    const user = await User.findOne({email: req.body.email})

    if(!user){
        return next(new AppError('Incorrect Email or password', 400))
    }

    res.status(200).json({
        status: "success",
        data: user
    })
});

exports.getUser = crudHandler.getOne(User);
exports.getAllUsers = crudHandler.getAll(User);

// Do NOT update passwords with this!
exports.updateUser = crudHandler.updateOne(User);
exports.deleteUser = crudHandler.deleteOne(User);

exports.getDocCount = crudHandler.getDocCount(User)

exports.scaffold = asyncHandler (async (req, res, next) => {
    res.status(200).json({
        status: "success",
        data: ''
    })
});
