const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

exports.getAll = Model => asyncHandler(async (req, res, next) => {
    const doc = await Model.find({active: true}).sort({'createdAt': -1});

    res.status(200).json({
        status: 'success',
        records: doc.length,
        data: doc
    });
});

exports.getAllAdvanced = Model => asyncHandler(async (req, res, next) => {
    let filter = {}

    const features = new APIFeatures(Model.find(filter).sort({'createdAt': -1}), req.query)
        .filter()
        .paginate();
    
    const doc = await features.query;
    const docCount = await Model.estimatedDocumentCount()

    res.status(200).json({
        status: 'success',
        records: docCount,
        data: doc
    });
});

exports.getAllWhere = (Model, option) => asyncHandler(async (req, res, next) => {
    let filter = {}

    const features = new APIFeatures(Model.find(option, filter).sort({'createdAt': -1}), req.query)
        .filter()
        .paginate();
    
    const doc = await features.query;
    const docCount = await Model.estimatedDocumentCount()

    res.status(200).json({
        status: 'success',
        records: doc.length,
        data: doc
    });
});

exports.getDocCount = Model => asyncHandler(async (req, res, next) => {
    const count = await Model.find({active: true}).countDocuments();

    res.status(200).json({
        status: "success",
        data: count
    })
});

exports.getOne = (Model, popOptions) => asyncHandler(async (req, res, next) => {
    let query = Model.findById(req.params.id);

    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      return next(new AppError(`No Document found with that ID`, 404));
    }

    res.status(200).json({
        status: 'success',
        data: doc
    });
});

exports.createOne = Model => asyncHandler(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
        status: 'success',
        data: doc
    });
});

exports.updateOne = Model => asyncHandler(async (req, res, next) => {
    if(!req.body) return next(new AppError(`Request body not valid`, 404));

    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!doc) {
       return next(new AppError(`No ${Model} found with that ID`, 404));
    }

    res.status(200).json({
        status: 'success',
        data: doc
    });
});

exports.deleteOne = Model => asyncHandler(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError(`No ${Model} found with that ID`, 404));
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
});