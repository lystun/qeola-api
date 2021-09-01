const mongoose = require('mongoose'); 

const briefSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter client name"]
    },
    email: {
        type: String,
        required: [true, "Please enter client email"]
    },
    phone: {
        type: String,
        required: [true, "Please enter client phone number"]
    },
    category: {
        type: mongoose.Schema.ObjectId,
        ref: 'Category',
        required: [true, "Please select brief category"]
    },
    briefFile: {
        type: String,
        required: [true, "Please upload brief link"]
    },
    briefText: {
        type: String,
        required: [true, "Please upload brief"]
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
});


briefSchema.pre(/find/, function(next){
    this.populate({ path: 'category', select: 'name'})

    next()
})

const Brief = mongoose.model('Brief', briefSchema);
module.exports = Brief;