const express = require('express');
const router = express.Router();

const {getClients, getClient, deleteClient, updateClient, createClient, getDocCount } = require('../controllers/clientController');
const {handleImageFromClient} = require('../controllers/awsController');

const { protect } = require('../controllers/authController');

//require the client seeder
const clientSeeder = require('../seeder/factories/clientSeeder');

router.route('/count').get(getDocCount)

router
    .route('/:id')
    .get(getClient)
    .delete(protect, deleteClient)
    .patch(protect, handleImageFromClient, updateClient)

router
    .route('/')
    .get(getClients)
    .post(protect, handleImageFromClient, createClient)


//seeder and clean
if(process.env.NODE_ENV == 'development'){
    router.post('/seed-clients', clientSeeder.seed)
    router.post('/clean-clients', clientSeeder.clean)
}

//export router
module.exports = router;