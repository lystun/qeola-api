const faker = require('faker');
const seederHandler = require('./seederHandler');

const Category = require('../../models/categoryModel');

let categories = [];

for(let i = 0; i < 5; i++ ){
    categories.push({
        name: faker.lorem.word(),
    })
}

exports.seed = seederHandler.seedData(Category, categories)
exports.clean = seederHandler.cleanData(Category)


