const express = require('express');
const router = express.Router();

const {getPosts, getPost, deletePost, updatePost, createPost, getDocCount } = require('./../controllers/postController');
const {handleImageFromClient} = require('./../controllers/awsController');

const { protect } = require('./../controllers/authController');

//require the post seeder
const postSeeder = require('./../seeder/factories/postSeeder');

router.route('/count').get(getDocCount)

router
    .route('/:id')
    .get(getPost)
    .delete(protect, deletePost)
    .patch(protect, handleImageFromClient, updatePost)

router
    .route('/')
    .get(getPosts)
    .post(protect, handleImageFromClient, createPost)


//seeder and clean
if(process.env.NODE_ENV == 'development'){
    router.post('/seed-posts', postSeeder.seed)
    router.post('/clean-posts', postSeeder.clean)
}

//export router
module.exports = router;