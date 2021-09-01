const mongoose = require('mongoose');
const colors = require('colors');

const dotenv = require('dotenv');
dotenv.config({path: './config.env'});

const app = require('./app');
const DB = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(con => {
    console.log('Connection Success'.blue)
}).catch(err => {
    if(process.env.NODE_ENV == "development"){
        console.log(err.red)
    }else {
        console.log("Something went wrong.")
    }
})


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Qeola api listening on port ${port}!`));