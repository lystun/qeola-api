const AppError = require('./../utils/appError');

const Post = require('./../models/postModel')

const crudHandler = require('./crudHandler');
const { uploadImage } = require('./awsController');

const asyncHandler = require('../utils/asyncHandler');

exports.createPost = asyncHandler( async (req, res, next) => {

    if (!req.file) return next(new AppError("You haven't uploaded any file.", 400))
    
    const ext = req.file.mimetype.split('/')[1]
    const fileName = `post-${Date.now()}.${ext}`;
    
    const result = await uploadImage(req, fileName, 'qeola-api/posts/images', next)
    req.body.image = result.Location;

    console.log(req.body);
    const post  = await Post.create(req.body);
    
    res.status(201).json({
        status: "success",
        data: post
    })
})

//update a document
exports.updatePost = asyncHandler (async (req, res, next) => {
    
    if(req.file){
        const ext = req.file.mimetype.split('/')[1];
        const fileName = `post-${Date.now()}.${ext}`;

        const result = await uploadImage(req, fileName, 'qeola-api/posts/images', next)
        req.body.image = result.Location;
    }

    const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!post) {
        return next(new AppError('No Post found with that ID', 404));
    }

    res.status(201).json({
        status: "success",
        data: post
    })
});

exports.getPosts = crudHandler.getAllAdvanced(Post); //get documents
exports.getPost = crudHandler.getOne(Post); //get document
exports.deletePost = crudHandler.deleteOne(Post) //delete document

exports.getDocCount = crudHandler.getDocCount(Post) //get document(s) count
