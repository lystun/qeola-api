const AppError = require('../utils/appError');
const Brief = require('../models/briefModel')

const crudHandler = require('./crudHandler');
const { uploadImage, uploadFile } = require('./awsController');

const asyncHandler = require('../utils/asyncHandler');

exports.createBrief = asyncHandler( async (req, res, next) => {

    if (!req.file) return next(new AppError("You haven't uploaded any file.", 400));
    
    const ext = req.file.mimetype.split('/')[1]
    const fileName = `brief-${Date.now()}.${ext}`;
    
    const result = await uploadFile(req, fileName, 'qeola-api/briefs', next);
    req.body.briefFile = result.Location;

    const brief  = await Brief.create(req.body);
    
    res.status(201).json({
        status: "success",
        data: brief
    })
})

//update a document
exports.updateBrief = asyncHandler (async (req, res, next) => {
    if(req.file){
        const ext = req.file.mimetype.split('/')[1];
        const fileName = `brief-${Date.now()}.${ext}`;

        const result = await uploadFile(req, fileName, 'qeola-api/briefs', next);
        req.body.briefFile = result.Location;
    }

    const brief = await Brief.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!brief) {
        return next(new AppError('No Brief found with that ID', 404));
    }

    res.status(201).json({
        status: "success",
        data: brief
    })
});

exports.getBriefs = crudHandler.getAllAdvanced(Brief); //get documents
exports.getBrief = crudHandler.getOne(Brief); //get document
exports.deleteBrief = crudHandler.deleteOne(Brief) //delete document

exports.getDocCount = crudHandler.getDocCount(Brief) //get document(s) count
