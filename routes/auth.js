/*
██╗███╗   ███╗██████╗  ██████╗ ██████╗ ████████╗███████╗
██║████╗ ████║██╔══██╗██╔═══██╗██╔══██╗╚══██╔══╝██╔════╝
██║██╔████╔██║██████╔╝██║   ██║██████╔╝   ██║   ███████╗
██║██║╚██╔╝██║██╔═══╝ ██║   ██║██╔══██╗   ██║   ╚════██║
██║██║ ╚═╝ ██║██║     ╚██████╔╝██║  ██║   ██║   ███████║
╚═╝╚═╝     ╚═╝╚═╝      ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚══════╝
*/

const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const { body } = require('express-validator');
const ifErrSendRes = require('../middleware/ifErrSendRes');
const isAuth = require('../middleware/isAuth');

/*
 ██████╗ ██████╗ ███╗   ██╗███████╗████████╗ █████╗ ███╗   ██╗███████╗
██╔════╝██╔═══██╗████╗  ██║██╔════╝╚══██╔══╝██╔══██╗████╗  ██║██╔════╝
██║     ██║   ██║██╔██╗ ██║███████╗   ██║   ███████║██╔██╗ ██║███████╗
██║     ██║   ██║██║╚██╗██║╚════██║   ██║   ██╔══██║██║╚██╗██║╚════██║
╚██████╗╚██████╔╝██║ ╚████║███████║   ██║   ██║  ██║██║ ╚████║███████║
 ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝╚══════╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═══╝╚══════╝
*/

const messages = {
    signin: {
        nickname: {
            length: 'Nickname should be between 3 nad 15 characters length.',
            syntax: 'Nickname should be alphanumeric.'
        },
        email: {
            default: 'This email is invalid.'
        },
        password: {
            length: 'Password should be between 8 nad 200 characters length.',
        },
        confirmPassword: {
            default: 'Passwords should have the same values.',
        }
    }
}

/*
██╗  ██╗███████╗██╗     ██████╗ ███████╗██████╗ ███████╗
██║  ██║██╔════╝██║     ██╔══██╗██╔════╝██╔══██╗██╔════╝
███████║█████╗  ██║     ██████╔╝█████╗  ██████╔╝███████╗
██╔══██║██╔══╝  ██║     ██╔═══╝ ██╔══╝  ██╔══██╗╚════██║
██║  ██║███████╗███████╗██║     ███████╗██║  ██║███████║
╚═╝  ╚═╝╚══════╝╚══════╝╚═╝     ╚══════╝╚═╝  ╚═╝╚══════╝
*/

isEqual = (bodyIndex) => (value, {req}) => value === req.body[bodyIndex]? true : false;

/*
██████╗  ██████╗ ██╗   ██╗████████╗███████╗███████╗
██╔══██╗██╔═══██╗██║   ██║╚══██╔══╝██╔════╝██╔════╝
██████╔╝██║   ██║██║   ██║   ██║   █████╗  ███████╗
██╔══██╗██║   ██║██║   ██║   ██║   ██╔══╝  ╚════██║
██║  ██║╚██████╔╝╚██████╔╝   ██║   ███████╗███████║
╚═╝  ╚═╝ ╚═════╝  ╚═════╝    ╚═╝   ╚══════╝╚══════╝
*/                                                   

router.post('/signin', [
    body('nickname')
        .isLength({min: 3, max: 15})
        .withMessage(messages.signin.nickname.length)
        .isAlphanumeric()
        .withMessage(messages.signin.nickname.syntax)
        .trim(),
    body('email', messages.signin.email.default)
        .isEmail()
        .normalizeEmail(),
    body('password', messages.signin.password.length)
        .isLength({min: 8, max: 200})
        .trim(),
    body('confirmPassword', messages.signin.confirmPassword.default)
        .custom(isEqual('password'))
        .not()
        .isEmpty()
        .trim()
], authController.createUser);

router.post('/login', [
    body('email', messages.signin.email.default)
        .isEmail(),
    body('password', messages.signin.password.length)
        .isLength({min: 8, max: 200})
    
], ifErrSendRes ,authController.login);

router.get('/contacts', isAuth, authController.getContacts);

router.post('/contacts', isAuth, authController.createContact);

module.exports = router;