const mongoose = require('mongoose'); 

const projectSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please enter project title"]
    },
    description: {
        type: String,
        required: [true, "Please enter project brief description"]
    },
    content: {
        type: String,
        required: [true, "Please enter project content"]
    },
    category: {
        type: mongoose.Schema.ObjectId,
        ref: 'Category',
        required: [true, "Please select project category"]
    },
    image: {
        type: String,
        required: [true, "Please upload project image"]
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

projectSchema.pre(/find/, function(next){
    this.populate({ path: 'category', select: 'name'})
    next()
})

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;