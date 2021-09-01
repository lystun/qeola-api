const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const userSchema = mongoose.Schema({
    name : {
        type: String,
    },
    email : {
        type: String,
        unique: true,
        lowercase: true,
        required : [true, "Please provide your email"],
        validate: [ validator.isEmail, 'Please provide a valid email' ]
    },
    password : {
        type: String,
        required : [true, "Please provide a password"],
        select: false
    },
    passwordConfirm : {
        type: String,
        required : [true, "Please confirm your password"],
        validate: {
            validator: function(el){
                return el === this.password
            },
            message: "Passwords do not match"
        }
    },
    passwordChangedAt: Date,
    passwordResetToken : String,
    passwordResetExpires : String,
    
    isVerified: { 
        type: Boolean, 
        default: true,
    },
    active: {
        type: Boolean,
        default: true,
        select: false
    }
},
{
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

//document queries middlewares
userSchema.pre('save', async function(next){
    //check if passord was modified
    if(!this.isModified('password')) return next();
    
    //hash the password
    this.password = await bcrypt.hash(this.password, 10)
    this.passwordConfirm = undefined
    next()
})

userSchema.pre('save', function(next){
    if(!this.isModified('password') || this.isNew ) return next()

    this.passwordChangedAt = Date.now() - 1000
    next()
})

userSchema.pre(/^find/, function(next){
    this.find({ active: {$ne: false} })
    next()
})

// instance methods
userSchema.methods.correctPassword = async function(candidatePasword, userPassword){
    return await bcrypt.compare(candidatePasword, userPassword)
}

userSchema.methods.changedPasswordAfter = async function(JWTTimestamp){
    if(this.passwordChangedAt){
        const changedTimesstamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10)
        return JWTTimestamp > changedTimesstamp
    }

    return false
}

// create password reset token
userSchema.methods.createPasswordResetToken = function(){
    const resetToken = crypto.randomBytes(32).toString('hex')

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    this.passwordResetExpires = Date.now() + 10*60*1000; // 10 minutes

    return resetToken;
}

const User = mongoose.model('User', userSchema)
module.exports = User