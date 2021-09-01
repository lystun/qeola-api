const faker = require('faker');
const seederHandler = require('./seederHandler');

const Project = require('../../models/projectModel');

const categories = ["612f779f76db6577d39b6050","612f75a21b5ece51571bb6bb", "612f7a8cd86a2667336438eb"] 

let projects = [];

for(let i = 0; i < 5; i++ ){
    projects.push({
        title: faker.lorem.sentence(),
        image: faker.image.imageUrl(),
        content: faker.lorem.paragraphs(),
        description: faker.lorem.sentence(),
        category: categories[Math.floor(Math.random() * categories.length)],
    })
}

exports.seed = seederHandler.seedData(Project, projects)
exports.clean = seederHandler.cleanData(Project)


