const User = require('../models/user');
const Room = require('../models/room');
const Mongoose = require('mongoose');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const IO = require('../socket');

/*
 ██████╗ ██████╗ ███╗   ██╗███████╗████████╗ █████╗ ███╗   ██╗███████╗
██╔════╝██╔═══██╗████╗  ██║██╔════╝╚══██╔══╝██╔══██╗████╗  ██║██╔════╝
██║     ██║   ██║██╔██╗ ██║███████╗   ██║   ███████║██╔██╗ ██║███████╗
██║     ██║   ██║██║╚██╗██║╚════██║   ██║   ██╔══██║██║╚██╗██║╚════██║
╚██████╗╚██████╔╝██║ ╚████║███████║   ██║   ██║  ██║██║ ╚████║███████║
 ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝╚══════╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═══╝╚══════╝
*/                                                                      

const saltRounds = 10;
const jwtPrivateKey = '#ym_A2w5^&]Zks65\6??*2rT?3qBjYT:MQ';

/*
 ██████╗ ██████╗ ███╗   ██╗████████╗██████╗  ██████╗ ██╗     ██╗     ███████╗██████╗ ███████╗
██╔════╝██╔═══██╗████╗  ██║╚══██╔══╝██╔══██╗██╔═══██╗██║     ██║     ██╔════╝██╔══██╗██╔════╝
██║     ██║   ██║██╔██╗ ██║   ██║   ██████╔╝██║   ██║██║     ██║     █████╗  ██████╔╝███████╗
██║     ██║   ██║██║╚██╗██║   ██║   ██╔══██╗██║   ██║██║     ██║     ██╔══╝  ██╔══██╗╚════██║
╚██████╗╚██████╔╝██║ ╚████║   ██║   ██║  ██║╚██████╔╝███████╗███████╗███████╗██║  ██║███████║
 ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚══════╝╚══════╝╚═╝  ╚═╝╚══════╝
*/                                                                                             

exports.createUser = async (req, res, next) => {
    const {nickname, email, password} = req.body;
    const errors = validationResult(req);

    if(!errors.isEmpty()) {

        return res.status(422).json(errors);
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    try {
        const newUser = new User({
            nickname, 
            email, 
            password: hashedPassword,
            accountType: 'customer'});

        await newUser.save();

        IO.getIO().emit('userSignIn', {userID: user._id, name: user.nickname})
        return res.status(200).json({message: 'User created!'});

    } catch (err) {
        res.status(500).json({message: err});
    }
}

exports.login = async (req, res, next) => {
    const {email, password} = req.body;

    try {

        const user = await User.findOne({email: email});

        if(!user) {
            return res.status(404).json({message: 'User with that email not found!'});
        }

        const hash = await bcrypt.compare(password, user.password);

        if(hash) {

            const userToken = jwt.sign({
                userID: user._id,
                email: user.email
            }, jwtPrivateKey);

            res.status(200).json({token: userToken});

        }
    } catch (err) {
        res.status(500).json({message: 'Something went wrong!'});
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
        
        res.status(200).json({contacts});
    
    } catch(err) {
        res.status(500).json({message: 'Something went wrong!'});
    }
}
exports.createContact = (req, res, next) => {
    const loggedUser = req.user;
    const userID = req.body.userID;

    const newRoom = new Room({
        messages: [],
        users: [
            loggedUser._id,
            userID
        ],
        type: 'private'
    });

    console.log(newRoom);
}