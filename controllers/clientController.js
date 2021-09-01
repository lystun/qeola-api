const AppError = require('../utils/appError');

const Client = require('../models/clientModel')

const crudHandler = require('./crudHandler');
const { uploadImage } = require('./awsController');

const asyncHandler = require('../utils/asyncHandler');

exports.createClient = asyncHandler( async (req, res, next) => {

    if (!req.file) return next(new AppError("You haven't uploaded any file.", 400))
    
    const ext = req.file.mimetype.split('/')[1]
    const fileName = `client-${Date.now()}.${ext}`;
    
    const result = await uploadImage(req, fileName, 'qeola-api/clients/images', next)
    req.body.image = result.Location;

    const client  = await Client.create(req.body)
    
    res.status(201).json({
        status: "success",
        data: client
    })
})

//update a document
exports.updateClient = asyncHandler (async (req, res, next) => {
    
    if(req.file){
        const ext = req.file.mimetype.split('/')[1];
        const fileName = `client-${Date.now()}.${ext}`;

        const result = await uploadImage(req, fileName, 'qeola-api/clients/images', next)
        req.body.image = result.Location;
    }

    const client = await Client.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!client) {
        return next(new AppError('No client found with that ID', 404));
    }

    res.status(201).json({
        status: "success",
        data: client
    })
});

exports.getClients = crudHandler.getAllAdvanced(Client); //get documents
exports.getClient = crudHandler.getOne(Client); //get document
exports.deleteClient = crudHandler.deleteOne(Client) //delete document

exports.getDocCount = crudHandler.getDocCount(Client) //get document(s) count
