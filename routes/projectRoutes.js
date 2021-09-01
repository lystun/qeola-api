const express = require('express');
const router = express.Router();

const {getProjects, getProject, deleteProject, updateProject, createProject, getDocCount } = require('../controllers/projectController');
const {handleImageFromClient} = require('../controllers/awsController');

const { protect } = require('../controllers/authController');

//require the project seeder
const projectSeeder = require('../seeder/factories/projectSeeder');

router.route('/count').get(getDocCount)

router
    .route('/:id')
    .get(getProject)
    .delete(protect, deleteProject)
    .patch(protect, handleImageFromClient, updateProject)

router
    .route('/')
    .get(getProjects)
    .post(protect, handleImageFromClient, createProject)


//seeder and clean
if(process.env.NODE_ENV == 'development'){
    router.post('/seed-projects', projectSeeder.seed)
    router.post('/clean-projects', projectSeeder.clean)
}

//export router
module.exports = router;