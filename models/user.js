const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    nickname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    accountType: {
        type: String,
        required: true
    },
    rooms: [
        {
            roomID: {
                type: mongoose.Types.ObjectId,
                required: true,
                ref: 'Room'
            }
        }
    ]
});

module.exports = mongoose.model('User', userSchema);