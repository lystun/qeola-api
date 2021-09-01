const faker = require('faker');
const seederHandler = require('./seederHandler');

const Post = require('../../models/postModel');

const categories = ["612f779f76db6577d39b6050","612f75a21b5ece51571bb6bb", "612f7a8cd86a2667336438eb"] 

let posts = [];

for(let i = 0; i < 5; i++ ){
    posts.push({
        title: faker.lorem.sentence(),
        image: faker.image.imageUrl(),
        content: faker.lorem.paragraphs(),
        author: faker.name.findName(),
        category: categories[Math.floor(Math.random() * categories.length)],
    })
}

exports.seed = seederHandler.seedData(Post, posts)
exports.clean = seederHandler.cleanData(Post)


