const faker = require('faker');
const seederHandler = require('./seederHandler');

const Client = require('../../models/clientModel');

const categories = ["612f779f76db6577d39b6050","612f75a21b5ece51571bb6bb", "612f7a8cd86a2667336438eb"] 

let clients = [];

for(let i = 0; i < 5; i++ ){
    clients.push({
        name: faker.lorem.word(),
        image: faker.image.imageUrl(),
        category: categories[Math.floor(Math.random() * categories.length)],
    })
}

exports.seed = seederHandler.seedData(Client, clients)
exports.clean = seederHandler.cleanData(Client)


