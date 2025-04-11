const joi = require('joi');
const CONST = require('../../utils/constant');
const userControllers = require('../../controller/userController');


module.exports = [
    {
        method: "POST",
        path: "/signup",
        joiSchema: {
            body: joi.object({
                name: joi.string().min(3).required(),
                email: joi.string().email().required(),
                password: joi.string().min(6).required(),
                mobile:joi.string().required(),
            }),
        },
        handler: userControllers.signup,
    },
    {
        method: "POST",
        path: "/login",
        joiSchema: {
            body: joi.object({
                email: joi.string().email().required(),
                password: joi.string().min(6).required(),
            }),
        },
        handler: userControllers.login,
    },
    {
        method: "GET",
        path: "/getProfile/:id",
        auth: CONST.AUTH_AVAIL,
        handler: userControllers.getProfileDetails,
    },
    // {
    //     method: "POST",
    //     path: "/forgetPassword",
    //     joiSchema: {
    //         body: joi.object({
    //             email:joi.string().email().required(),
    //         })
    //     },
    //     handler:userControllers.forgetPassword
    // },
    // {
    //     method: "POST",
    //     path: "/changePassword",
    //     joiSchema: {
    //         body: joi.object({
    //             otp:joi.string().required(),
    //             password:joi.string().required(),
    //         })
    //     },
    //     handler:userControllers.changePassword,
    // }
]