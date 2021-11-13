const mailchimp = require('@mailchimp/mailchimp_marketing');

const AppError = require('./../utils/appError');
const asyncHandler = require('../utils/asyncHandler');

mailchimp.setConfig({
    apiKey: process.env.MAILCHIMP_APIKEY,
    server: process.env.MAILCHIMP_SERVER,
});

exports.pingMail = asyncHandler( async (req, res, next) => {
    
    const response = await mailchimp.ping.get();
    console.log(response);

    res.status(201).json({
        status: "success",
        data: response
    })
});

exports.addSubscriber = asyncHandler( async (req, res, next) => {
    if(!req.body.email ) {
        return next(new AppError("Some parameters are missing", 400));
    }

    let response;
    const list_id = "b3a6f7ae3b";

    try {
        response = await mailchimp.lists.addListMember(list_id, {
            email_address: req.body.email,
            status: "subscribed"
        });
    }catch(e){     
        return next(new AppError(e.response.body.title, e.response.body.status));
    }

    res.status(201).json({
        status: "success",
        data: response
    })
});
