const fs = require('fs');
const seederHandler = require('./seederHandler');

const User = require('../../models/userModel');

const users = JSON.parse(
    fs.readFileSync(`${__dirname}/../_data/users.json`, 'utf-8')
);

exports.seed = seederHandler.seedData(User, users)
exports.clean = seederHandler.cleanData(User)


