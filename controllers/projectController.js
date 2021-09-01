const AppError = require('../utils/appError');

const Project = require('../models/projectModel')

const crudHandler = require('./crudHandler');
const { uploadImage } = require('./awsController');

const asyncHandler = require('../utils/asyncHandler');

exports.createProject = asyncHandler( async (req, res, next) => {

    if (!req.file) return next(new AppError("You haven't uploaded any file.", 400))
    
    const ext = req.file.mimetype.split('/')[1]
    const fileName = `project-${Date.now()}.${ext}`;
    
    const result = await uploadImage(req, fileName, 'qeola-api/projects/images', next)
    req.body.image = result.Location;

    const project  = await Project.create(req.body)
    
    res.status(201).json({
        status: "success",
        data: project
    })
})

//update a document
exports.updateProject = asyncHandler (async (req, res, next) => {
    
    if(req.file){
        const ext = req.file.mimetype.split('/')[1];
        const fileName = `project-${Date.now()}.${ext}`;

        const result = await uploadImage(req, fileName, 'qeola-api/projects/images', next)
        req.body.image = result.Location;
    }

    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!project) {
        return next(new AppError('No Project found with that ID', 404));
    }

    res.status(201).json({
        status: "success",
        data: project
    })
});

exports.getProjects = crudHandler.getAllAdvanced(Project); //get documents
exports.getProject = crudHandler.getOne(Project); //get document
exports.deleteProject = crudHandler.deleteOne(Project) //delete document

exports.getDocCount = crudHandler.getDocCount(Project) //get document(s) count
