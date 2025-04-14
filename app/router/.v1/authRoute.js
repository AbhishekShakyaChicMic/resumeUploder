const joi = require('joi');
const authControllers = require('../../controller/authController');


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
        handler: authControllers.signup,
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
        handler: authControllers.login,
    }
]