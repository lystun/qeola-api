const mongoose = require('mongoose'); 

const bookSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please enter book title"]
    },
    description: {
        type: String,
        required: [true, "Please enter book content"]
    },
    category: {
        type: mongoose.Schema.ObjectId,
        ref: 'Category',
        required: [true, "Please select book category"]
    },
    image: {
        type: String,
        required: [true, "Please upload book image"]
    },
    link: {
        type: String,
        required: [true, "Please upload book link"]
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


bookSchema.pre(/find/, function(next){
    this.populate({ path: 'category', select: 'name image'})

    next()
})

const Book = mongoose.model('Book', bookSchema);
module.exports = Book;