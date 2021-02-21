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
	const { nickname, email, password } = req.body;
	const errors = validationResult(req);

	const hashedPassword = await bcrypt.hash(password, saltRounds);

	try {
		const user = await User.findOne({ nickname });

		if (user) {
			const errData = [
				{
					name: 'nickname',
					value: 'User with that nickname exist.'
				}
			];
			const err = new Error();
			err.json = errData;
			err.status = 422;

			return next(err);
		}

		const newUser = new User({
			nickname,
			email,
			password: hashedPassword,
			accountType: 'customer'
		});

		const createdUser = await newUser.save();

		await Room.findOneAndUpdate(
			{ type: 'public' },
			{ $push: { users: createdUser._id } }
		);

		return res.status(200).json({ message: 'User created!' });
	} catch (err) {
		return next();
	}
};

exports.login = async (req, res, next) => {
	const { email, password } = req.body;

	try {
		const user = await User.findOne({ email: email });

		if (!user) {
			const error = new Error('User with that email not found!');
			error.status(404);

			return next(error);
		}

		const hash = await bcrypt.compare(password, user.password);

		if (hash) {
			const userToken = jwt.sign(
				{
					userID: user._id,
					email: user.email
				},
				jwtPrivateKey
			);

			res.status(200).json({ token: userToken });
		}
	} catch (err) {
		return next();
	}
};

exports.forgotPassword = async (req, res, next) => {
	const { email } = req.body;

	try {
		const user = await User.findOne({ email: email });

		if (!user) {
			const error = new Error('User not found');
			error.status = 404;

			next(error);
		} else {
			return res.status(200).json({
				header: 'Well done!',
				message: 'Now check your email for next instructions.'
			});
		}
	} catch (err) {
		return next();
	}
};
