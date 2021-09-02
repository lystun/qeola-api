const express = require('express');
const authController = require('./../controllers/authController');

const router = express.Router()


router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/forgot-password', authController.forgotPassword);
router.patch('/reset-password/:token', authController.resetPassword);

router.post('/email-verification', authController.verificationEmail);
router.post('/resend-email-verification', authController.resendVerificationEmail);

router.post('/send-message', authController.sendMessage);
    
router.use(authController.protect)
router.post('/update-password', authController.updatePassword )

module.exports = router