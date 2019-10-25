const jwt = require('jsonwebtoken');
const User = require('../models/user');

const jwtPrivateKey = '#ym_A2w5^&]Zks65\6??*2rT?3qBjYT:MQ';

module.exports = async (req, res, next) => {
    const token = req.headers.authorization;
    
    if(token.length !== 0) {
        try{
            const tokenRes = await jwt.verify(token, jwtPrivateKey);
            const user = await User.findById(tokenRes.userID);

            req.user = user;

            return next();

        } catch (err) {

            return res.status(401).json({message: 'Not authorized!'});
        }
    }

    return res.status(401).json({message: 'Not authorized!'});
}