const mongoose = require('mongoose'); 

const clientSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter client name"]
    },
    category: {
        type: mongoose.Schema.ObjectId,
        ref: 'Category',
        required: [true, "Please select client category"]
    },
    image: {
        type: String,
        required: [true, "Please upload client image"]
    },
    active: {
        type: Boolean,
        default: true,
        select: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
},
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

clientSchema.pre(/find/, function(next){
    this.populate({ path: 'category', select: 'name'})
    next()
})

const Client = mongoose.model('Client', clientSchema);
module.exports = Client;