const io = require('../socket');

exports.getNotifications = (req, res, next) => {
    io.getIO().emit('userLogin', {wow: 'no wow'});
}