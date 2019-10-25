const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const roomSchema = new Schema({
    messages: [
        {
            userID: {
                type: mongoose.Types.ObjectId,
                required: true,
                ref: 'User'
            },
            content: {
                type: String,
                required: true
            },
            date: {
                type: Date,
                required: true
            }
        }
    ],
    users: [
        {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: 'User'
        }
    ],
    type: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Room', roomSchema);