/*
██╗███╗   ███╗██████╗  ██████╗ ██████╗ ████████╗███████╗
██║████╗ ████║██╔══██╗██╔═══██╗██╔══██╗╚══██╔══╝██╔════╝
██║██╔████╔██║██████╔╝██║   ██║██████╔╝   ██║   ███████╗
██║██║╚██╔╝██║██╔═══╝ ██║   ██║██╔══██╗   ██║   ╚════██║
██║██║ ╚═╝ ██║██║     ╚██████╔╝██║  ██║   ██║   ███████║
╚═╝╚═╝     ╚═╝╚═╝      ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚══════╝
*/

const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const { body } = require("express-validator");
const ifErrSendRes = require("../middleware/ifErrSendRes");

/*
 ██████╗ ██████╗ ███╗   ██╗███████╗████████╗ █████╗ ███╗   ██╗███████╗
██╔════╝██╔═══██╗████╗  ██║██╔════╝╚══██╔══╝██╔══██╗████╗  ██║██╔════╝
██║     ██║   ██║██╔██╗ ██║███████╗   ██║   ███████║██╔██╗ ██║███████╗
██║     ██║   ██║██║╚██╗██║╚════██║   ██║   ██╔══██║██║╚██╗██║╚════██║
╚██████╗╚██████╔╝██║ ╚████║███████║   ██║   ██║  ██║██║ ╚████║███████║
 ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝╚══════╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═══╝╚══════╝
*/

const messages = {
        nickname: {
            length: "Nickname should be between 3 nad 15 characters length.",
            syntax: "Nickname should be alphanumeric."
        },
        email: {
            default: "This email is invalid."
        },
        password: {
            length: "Password should be between 8 nad 200 characters length.",
        },
        confirmPassword: {
            default: "Passwords should have the same values.",
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

isEqual = (bodyIndex) => (value, {req}) => value === req.body[bodyIndex];

/*
██████╗  ██████╗ ██╗   ██╗████████╗███████╗███████╗
██╔══██╗██╔═══██╗██║   ██║╚══██╔══╝██╔════╝██╔════╝
██████╔╝██║   ██║██║   ██║   ██║   █████╗  ███████╗
██╔══██╗██║   ██║██║   ██║   ██║   ██╔══╝  ╚════██║
██║  ██║╚██████╔╝╚██████╔╝   ██║   ███████╗███████║
╚═╝  ╚═╝ ╚═════╝  ╚═════╝    ╚═╝   ╚══════╝╚══════╝
*/                                                   

router.post("/signin", [
    body("nickname")
        .isLength({min: 3, max: 15})
        .withMessage(messages.nickname.length)
        .isAlphanumeric()
        .withMessage(messages.nickname.syntax)
        .trim(),
    body("email", messages.email.default)
        .isEmail()
        .normalizeEmail(),
    body("password", messages.password.length)
        .isLength({min: 8, max: 200})
        .trim(),
    body("confirmPassword", messages.confirmPassword.default)
        .custom(isEqual("password"))
        .not()
        .isEmpty()
        .trim()
], authController.createUser);

router.post("/login", [
    body("email", messages.email.default)
        .isEmail(),
    body("password", messages.password.length)
        .isLength({min: 8, max: 200})
    
], ifErrSendRes, authController.login);

router.post("/forgot-password",
    body("email", messages.email.default).isEmail(),
    ifErrSendRes,
    authController.forgotPassword);

module.exports = router;