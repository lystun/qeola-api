const faker = require('faker');
const seederHandler = require('./seederHandler');

const Brief = require('../../models/briefModel');

const categories = ["612f779f76db6577d39b6050","612f75a21b5ece51571bb6bb", "612f7a8cd86a2667336438eb"] 

let briefs = [];

for(let i = 0; i < 5; i++ ){
    briefs.push({
        name: faker.name.findName(),
        email: faker.internet.email(),
        phone: faker.phone.phoneNumber(),
        briefText: faker.lorem.paragraphs(),
        briefFile: faker.internet.url(),
        category: categories[Math.floor(Math.random() * categories.length)],
    })
}

exports.seed = seederHandler.seedData(Brief, briefs)
exports.clean = seederHandler.cleanData(Brief)


