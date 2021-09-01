const express = require('express');
const router = express.Router();

const { getCategories, getCategory, getDocCount, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
const { protect, restrictTo } = require('../controllers/authController');

//require the post seeder
const categorySeeder = require('../seeder/factories/categorySeeder');

//get document count
router.route('/count').get(getDocCount)

router
    .route('/:id')
    .get(getCategory) //get one document
    .patch(protect, updateCategory) //update document
    .delete(protect, deleteCategory) //delete document

router
    .route('/')
    .get(getCategories) //get all document(s)
    .post(protect, createCategory) //create new document


//seeder and clean
if(process.env.NODE_ENV == 'development'){
    router.post('/seed-categories', categorySeeder.seed)
    router.post('/clean-categories', categorySeeder.clean)
}

//export router
module.exports = router;