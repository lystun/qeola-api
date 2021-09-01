const colors = require('colors');
const AppError = require('./../../utils/appError');

exports.seedData = (Model, data) => (async(req, res, next) => {
    try {
        const doc = await Model.find(); // find pre-existing documents
        if(doc && doc.length > 0 ) return next(new AppError(`Model already seeded.`, 400)); //exit the function if doc is not empty

        const seed = await Model.create(data); //create the seeders
        if(seed) console.log('Model seeded successfully'.green.inverse);

        return res.status(200).json({
            status: 'success',
            data: seed
        });

    } catch (err) {
        return next(new AppError(`Model Seeding failed - ${err}.`, 400))
    }
        
    
});

exports.cleanData = (Model, data) => (async(req, res, next) => {
    try {
		await Model.deleteMany();
		console.log('Data destroyed successfully...'.red.inverse);
        
	} catch (err) {
        return next(new AppError(`Model cleaned successfully - ${err}.`, 400))
	}

    return res.status(200).json({
        status: 'success',
    });
});
