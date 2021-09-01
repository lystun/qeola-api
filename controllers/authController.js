const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { promisify } = require('util');

const User = require('./../models/userModel');

const AppError = require('./../utils/appError');
const Email = require('./../utils/email');

const asyncHandler = require('../utils/asyncHandler');

const signToken = id => {
    return jwt.sign(
        { id, },    
        process.env.JWT_SECRET, 
        { expiresIn: process.env.JWT_EXPIRES_IN }
    )
}

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id)

    const cookieOptions = {
        expires: new Date( Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true
    }

    if( process.env.NODE_ENV === 'production' ) cookieOptions.secure = true
    
    res.cookie('jwt', token, cookieOptions)

    //remove the password from the output
    user.password = undefined

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user,
        }
    })
}

exports.sendMail = asyncHandler( async (req, res, next) => {
    const datetime = "2021-07-05T01:00:00";
    const date = datetime.split('T')[0];
    const timeExtract = datetime.split('T')[1];
    const time = timeExtract.substring(0,5);

    const user = {
        email: 'lystuntest@gmail.com',
        name: 'Ola test',
    }

    try{
        await new Email(user, url).sendScanResultHealthy();

    }catch(err){
        console.log(err)
    }

    res.status(200).json({
        status: "success",
        data: "sent"
    })
});

//send client email to admin
exports.sendMessage = asyncHandler( async (req, res, next) => {

    const {fname, lname, message, email} = req.body;

    const user = {
        name: fname+' '+lname,
        email: 'thevirtualsoulclinic@gmail.com',
        message,
        date: new Date().toUTCString(),
    }

    const url = email;

    try{
        await new Email(user, url).sendMessage();
    }catch(err){
        console.log(err)
    }

    res.status(200).json({
        status: "success",
        data: 'mail sent'
    })
});

//register new user
exports.register = asyncHandler(async(req, res, next) => {

    //check if user email already exists
    const email = await User.findOne({ email: req.body.email });
	if (email) return next(new AppError('Email already exist. Please use another email address', 400));
    
    //create user
    const newUser = await User.create(req.body);
     
    createSendToken(newUser, 201, res);
});

//verify email address
exports.verificationEmail = asyncHandler(async (req, res, next) => {
    
    const {token} = req.body
    if(!token) return next(new AppError("Please enter token.", 400));

    //get hashed token
    const verificationToken = crypto.createHash('sha256').update(req.body.token).digest('hex');

    //check if user exists from the token and if the user isn't verified already. 
	const user = await User.findOne({
		verificationToken,
		verificationTokenExpires: { $gt: Date.now() },
	});
    
    if(!user) return next(new AppError("We are unable to find a user for this token. Token may have expired.", 400));
    if(user.isVerified) return next(new AppError("This user has already been verified.", 400));

    // set user verification status to true and others to undefined, then save
    user.isVerified = true;
    user.verificationToken = undefined
    user.verificationTokenExpires = undefined

    await user.save({ validateBeforeSave: false });

    res.status(200).json({
        status: 'success',
        msg: 'Your account has been successfully verified. Please proceed to login.'
    });

})

//resend verification email
exports.resendVerificationEmail = asyncHandler(async (req, res, next) => {
    //get user email
    const { email } = req.body;
    if(!email) return next(new AppError("Please enter email address.", 400));

    const user = await User.findOne({email});
    
    //check if the user exist and if the user is not already verified.
    if(!user) return next(new AppError("User email does not exist. Proceed to registration.", 400));
    if(user.isVerified) return next(new AppError("This user has already been verified. You can continue to log in", 400));

    //create verification token for new user
    const token = user.createVerificationToken()
    await user.save({ validateBeforeSave: false })

    //send verification email
    const verificationUrl = `${process.env.APP_URL}/auth/email-verification/${token}`;
    await new Email(user, verificationUrl).sendWelcome();

    res.status(200).json({
        status: 'success',
        msg: 'A verification email has been sent to your email address.'
    });
})

// login user
exports.login = asyncHandler(async (req, res, next) => {

    const { email, password } = req.body

    //check if email and password exist
    if(!email || !password){
        return next(new AppError('Please, provide email and password', 400))
    }
    
    //check if the user exists and password is correct
    const user = await User.findOne({email}).select('+password')
    
    if(!user || !(await user.correctPassword(password, user.password)) ){
        return next(new AppError('Incorrect email or password', 401))
    }

    //check if the use has verified his email
    if(!user.isVerified) return next(new AppError('Please check your mailbox to verify your email address.', 401))

    //if all is alright, send token to client
    createSendToken(user, 200, res)
})

//logout
exports.logout = (req, res) => {
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });

    res.status(200).json({ 
        status: 'success' 
    });
};
  
//protect routes
exports.protect = asyncHandler(async (req, res, next) => {
    
    //1.Get the token and check if it exists
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1]
    }
    
    if(!token){
        return next(new AppError("You're not logged in. Please log in.", 401));
    };
    
    //2.verify the token
    const decoded = await promisify(jwt.verify) (token, process.env.JWT_SECRET)
    
    //3.check if user still exists
    const freshUser = await User.findById(decoded.id)

    if(!freshUser){
        return next(new AppError('The user belonging to the token no longer exists', 401))
    }
    
    //4. check if user changes password after the token was issued
    if(!freshUser.changedPasswordAfter(decoded.iat)){
        return next(new AppError('User recently changed the password', 401))
    }
    
    //Grant access to protected route
    req.user = freshUser;
    next()  
})

//We can't pass arguments into a middleware so we do it this way
exports.restrictTo = (...roles) => {
    return asyncHandler (async (req, res, next) => {   

        //roles ['admin', 'support-coach', 'specialized-coach', lead-coach, 'user']. role='user'
        if( !roles.includes(req.user.role) ){
            return next(new AppError('You do not have permission to perform this action!', 403))
        }
        next()
    })
}

//forgot password
exports.forgotPassword = asyncHandler( async(req, res, next) => { 

    //1. Get user based on email
    const user = await User.findOne( {email: req.body.email})
    
    if(!user){
        return next(new AppError("There is no user with that email address.", 404));
    }

    //2. Generate random token
    const resetToken = user.createPasswordResetToken()
    await user.save({ validateBeforeSave: false })

    //3. Send to user's email   
    try {   
        const resetURL = `${process.env.APP_URL}/auth/reset-password/${resetToken}`;

        await new Email(user, resetURL).sendPasswordReset()
    
        res.status(200).json({
            status: 'success',
            message: 'Token sent to email!' 
        })

    } catch (err) {

        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;

        await user.save({ validateBeforeSave: false })
        return next(new AppError(`There was an error sending the email`, 500))
    }
})

// reset password
exports.resetPassword = asyncHandler( async(req, res, next) => {
    
    //1. Get user based on token
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
    
    const user = await User.findOne({ 
        passwordResetToken : hashedToken,
        passwordResetExpires : { $gt: Date.now() }
    })
    
    //2. if token has not expired, and there is user, set new password
    if(!user){
        return next(new AppError('Token is invalid.', 400))
    }

    user.password = req.body.password
    user.passwordConfirm = req.body.passwordConfirm

    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined

    await user.save()

    //3. update changedpasswordat property for the user


    //4. log the user in, send jwt
    createSendToken(user, 200, res)
})

// update password
exports.updatePassword = asyncHandler( async(req, res, next) => {
    // 1. Get user from collection
    const user = await User.findById(req.user._id).select('+password')
    
    //2. If posted password is correct
    if(!(await user.correctPassword(req.body.passwordCurrent, user.password))){
        return next(new AppError("Your current password in incorrect.", 400));
    }
    
    if( req.body.password !== req.body.passwordConfirm ){
        return next(new AppError("Password confirmation does not match.", 400));
    }
    
    //3. If password is correct, update the password
    user.password = req.body.password
    user.passwordConfirm = req.body.passwordConfirm

    await user.save();
    
    //4. log the user in
    createSendToken(user, 200, res)
})