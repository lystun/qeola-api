const express = require('express');
const router = express.Router();

const {getBooks, getBook, deleteBook, updateBook, createBook, getDocCount } = require('../controllers/bookController');
const {handleImageFromClient} = require('../controllers/awsController');

const { protect, restrictTo } = require('../controllers/authController');

//require the book seeder
const bookSeeder = require('../seeder/factories/bookSeeder');

router.route('/count').get(getDocCount)

router
    .route('/:id')
    .get(getBook)
    .delete(protect, restrictTo('admin', 'lead-coach'), deleteBook)
    .patch(protect, restrictTo('admin', 'lead-coach'), handleImageFromClient, updateBook)

router
    .route('/')
    .get(getBooks)
    .post(protect, restrictTo('admin', 'lead-coach'), handleImageFromClient, createBook)


//seeder and clean
if(process.env.NODE_ENV == 'development'){
    router.post('/seed-books', bookSeeder.seed)
    router.post('/clean-books', bookSeeder.clean)
}

//export router
module.exports = router;