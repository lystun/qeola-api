const AppError = require('../utils/appError');

const Book = require('../models/bookModel')

const crudHandler = require('./crudHandler');
const { uploadImage } = require('./awsController');

const asyncHandler = require('../utils/asyncHandler');

exports.createBook = asyncHandler( async (req, res, next) => {

    if (!req.file) return next(new AppError("You haven't uploaded any file.", 400))
    
    const ext = req.file.mimetype.split('/')[1]
    const fileName = `book-${Date.now()}.${ext}`;
    
    const result = await uploadImage(req, fileName, 'the-soul-clinic/books/images', next)
    req.body.image = result.Location;

    const book  = await Book.create(req.body)
    
    res.status(201).json({
        status: "success",
        data: book
    })
})

//update a document
exports.updateBook = asyncHandler (async (req, res, next) => {
    if(req.file){
        const ext = req.file.mimetype.split('/')[1];
        const fileName = `book-${Date.now()}.${ext}`;

        const result = await uploadImage(req, fileName, 'the-soul-clinic/books/images', next)
        req.body.image = result.Location;
    }

    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!book) {
        return next(new AppError('No Book found with that ID', 404));
    }

    res.status(201).json({
        status: "success",
        data: book
    })
});


exports.getBooks = crudHandler.getAllAdvanced(Book); //get documents
exports.getBook = crudHandler.getOne(Book); //get document
exports.deleteBook = crudHandler.deleteOne(Book) //delete document

exports.getDocCount = crudHandler.getDocCount(Book) //get document(s) count
