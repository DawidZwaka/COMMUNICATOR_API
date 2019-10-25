const { validationResult } = require('express-validator');

module.exports = (req, res, next) => {
    const validation = validationResult(req);
    if(validation.isEmpty() ) {
        return next();
    }

    const parsedErrors = {};

    validation.errors.forEach(err => {
        parsedErrors[err.param] = err.msg 
    });

    return res.status(422).json(parsedErrors);
}