const express = require('express');
const router = express.Router();

const {getBriefs, getBrief, deleteBrief, updateBrief, createBrief, getDocCount } = require('../controllers/briefController');
const {handleImageFromClient, handleFileFromClient} = require('../controllers/awsController');

const { protect } = require('../controllers/authController');

//require the brief seeder
const briefSeeder = require('../seeder/factories/briefSeeder');

router.route('/count').get(getDocCount)

router
    .route('/:id')
    .get(getBrief)
    .delete(protect, deleteBrief)
    .patch(protect, handleFileFromClient, updateBrief)

router
    .route('/')
    .get(getBriefs)
    .post(protect, handleFileFromClient, createBrief)


//seeder and clean
if(process.env.NODE_ENV == 'development'){
    router.post('/seed-briefs', briefSeeder.seed)
    router.post('/clean-briefs', briefSeeder.clean)
}

//export router
module.exports = router;