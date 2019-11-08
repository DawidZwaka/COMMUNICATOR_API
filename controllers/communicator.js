const User = require('../models/user');
const Room = require('../models/room');
const Mongoose = require('mongoose');

exports.getRooms = async (req, res, next) => {
    const roomID = req.params.roomID;
    
    try {
        const room = await Room.findById(roomID).populate('users', 'nickname');

        if(room) {
            res.status(200).json(room);

        } else {
            const err = Error('Room not found!');
            err.status = 404;

            return next(err);
        }

    } catch(err) {
        const error = new Error('Something went wrong!');

        return next(error);
    }
}

exports.getContacts = async (req, res, next) => {
    const user = req.user;

    try {
        const users = await User.find({ _id: { $not: { $eq: new Mongoose.Types.ObjectId(user._id)} } });
        const rooms = await Room.find({users: { $in: [ new Mongoose.Types.ObjectId(user._id) ] } });


        const contacts = users.map( user => {
                const {nickname} = user;
            

                for( room of rooms) {
                    if(room.type === 'public') continue;
                    
                    for( roomUsersID of room.users) {
                        if( String(roomUsersID) === String(user._id) ) {

                            return {
                                _id: room._id,
                                type: 'room',
                                nickname
                            };
                        }
                    }
                }

                return {
                    _id: user._id,
                    type: 'user',
                    nickname
                }
            });
        
        res.status(200).json(contacts);
    
    } catch(err) {
        const error = new Error('Something went wrong!');

        return next(error);
    }
}

exports.createContact = async (req, res, next) => {
    const { _id: loggedUserID } = req.user,
        { userID } = req.body,
        users = [loggedUserID, userID];

    const newRoom = new Room({
        messages: [],
        users,
        type: 'private'
    });

    try {
        const isRoomExist = await Room.findOne({users: {$eq: users} });
        if(isRoomExist) {
            const error = new Error('Room exist!');
            error.status = 422;

            return next(error);
        }

        const { _id: roomID } = await newRoom.save();
        
        res.status(201).json({message: 'room created!', roomID});
    } catch(err) {
        const error = new Error('Something went wrong!');

        return next(error);
    }
}

exports.createMessage = async (req, res, next) => {
    const {message, roomID} = req.body;
    message.date = new Date;

    try {
        const updatedRoom = await Room.findByIdAndUpdate(roomID, {$push: {messages: message} });
        
        res.status(201).json({message: 'Message created.'});
    } catch(err) {
        const error = new Error('Something went wrong!');

        return next(error);
    }
}