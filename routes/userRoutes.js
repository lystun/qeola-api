const express = require('express');
const { getAllUsers, handleImageFromClient, updateMe, updateUser, deleteUser, deleteMe, getMe, getUserByEmail, getUser } = require('./../controllers/userController');
const { protect, restrictTo } = require('./../controllers/authController');
const userSeeder = require('./../seeder/factories/userSeeder');
const subscriberController = require('./../controllers/subcriberController');

const router = express.Router();

router.delete('/delete-me', protect, deleteMe);
router.get('/me', getMe )
router.post('/get-user', getUserByEmail)
router.post('/ping', subscriberController.pingMail)
router.post('/subscribe', subscriberController.addSubscriber)

//users
router.patch('/update-me', protect, handleImageFromClient, updateMe);
router.route('/') .get(getAllUsers);

router
    .route('/:id')
    .get(getUser)
    .patch(protect, updateUser)
    .delete(protect, deleteUser)

//seeder || clean
if(process.env.NODE_ENV == 'development'){
    router.post('/seed-users', userSeeder.seed)
    router.post('/clean-users', userSeeder.clean)
}

module.exports = router