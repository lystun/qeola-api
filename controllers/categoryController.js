//import controller(s) handler for recurring operations; CRUD
const crudHandler = require('./crudHandler');

//import model
const Category = require('./../models/categoryModel');

exports.createCategory = crudHandler.createOne(Category); //create document
exports.updateCategory = crudHandler.updateOne(Category); //update document
exports.getCategories = crudHandler.getAllAdvanced(Category); //get documents
exports.getCategory = crudHandler.getOne(Category); //get document
exports.deleteCategory = crudHandler.deleteOne(Category) //delete document

exports.getDocCount = crudHandler.getDocCount(Category) //get document(s) count


