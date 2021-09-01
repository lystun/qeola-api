const express = require('express');
const app = express();

const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const hpp = require('hpp')
const cors = require('cors');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

//import routes handler
const routers = require('./routes/router');

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

//limit request from same IP
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, Please try again in an hour.'
});

//middleware
app.use('/api', limiter); //limit request rate
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`)); //serving static files
app.use(hpp());
app.use(mongoSanitize());
app.use(xss());
app.use(cors());

app.use('/api/v1/', routers)

// for unmapped routes
app.all('*', (req, res, next)=> {
    next(new AppError(`This route ${req.originalUrl} does not exist on this server`, 404))
})

//global error handler
app.use(globalErrorHandler)


module.exports = app;