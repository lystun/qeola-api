const faker = require('faker');
const seederHandler = require('./seederHandler');

const Book = require('../../models/bookModel');

let books = [];

const categories = ["6093f8e6d30ddf2500c4b16c","6093fbf78fc16401809bb66e","609420fd6cb1205e906d96d3", "60957834e775cf3dc4728f27"] 

for(let i = 0; i < 5; i++ ){
    books.push({
        title: faker.lorem.sentence(),
        image: faker.image.imageUrl(),
        category: categories[Math.floor(Math.random() * categories.length)],
        description: faker.lorem.sentences(),
        link: faker.internet.url(),
    })
}

exports.seed = seederHandler.seedData(Book, books)
exports.clean = seederHandler.cleanData(Book)


