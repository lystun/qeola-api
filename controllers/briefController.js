const AppError = require('../utils/appError');
const Brief = require('../models/briefModel');
const cron = require('node-schedule');

const crudHandler = require('./crudHandler');
const { uploadImage, uploadFile } = require('./awsController');

const asyncHandler = require('../utils/asyncHandler');
const Email = require('../utils/email');

exports.createBrief = asyncHandler( async (req, res, next) => {

    const {name, phone, email, briefText} = req.body;

    if (!req.file) return next(new AppError("You haven't uploaded any file.", 400));
    
    const ext = req.file.mimetype.split('/')[1]
    const fileName = `brief-${Date.now()}.${ext}`;
    
    const result = await uploadFile(req, fileName, 'qeola-api/briefs', next);
    req.body.briefFile = result.Location;
    
    const brief  = await Brief.create(req.body);

    const user = {
        name,
        email,
        phone,
        message: briefText,
        date: new Date().toUTCString(),
    }

    const url = result.Location;

    cron.scheduleJob( new Date(Date.now() + 1000) , async function(){
        try{
            await new Email(user, url).sendClientBrief();
        }catch(err){
            return next(new AppError(`Error Sending email. Please try again later. ${err}`, 400));
        }
    });
    
    res.status(201).json({
        status: "success",
        data: brief
    })
})

//update a document
exports.updateBrief = asyncHandler (async (req, res, next) => {

    const {name, phone, email, briefText} = req.body;

    if(req.file){
        const ext = req.file.mimetype.split('/')[1];
        const fileName = `brief-${Date.now()}.${ext}`;

        const result = await uploadFile(req, fileName, 'qeola-api/briefs', next);
        req.body.briefFile = result.Location;

        const user = {
            name,
            email,
            phone,
            message: briefText,
            date: new Date().toUTCString(),
        }
    
        const url = result.Location;
    
        cron.scheduleJob( new Date(Date.now() + 1000) , async function(){
            try{
                await new Email(user, url).sendClientBrief();
            }catch(err){
                return next(new AppError(`Error Sending email. Please try again later. ${err}`, 400));
            }
        });
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
