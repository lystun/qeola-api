const mongoose = require('mongoose'); 

const postSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please enter post title"]
    },
    author: {
        type: String,
        required: [true, "Please enter post author"]
    },
    content: {
        type: String,
        required: [true, "Please enter post content"]
    },
    category: {
        type: mongoose.Schema.ObjectId,
        ref: 'Category',
        required: [true, "Please select post category"]
    },
    image: {
        type: String,
        required: [true, "Please upload post image"]
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

postSchema.pre(/find/, function(next){
    this.populate({ path: 'category', select: 'name'})
    next()
})

const Post = mongoose.model('Post', postSchema);
module.exports = Post;