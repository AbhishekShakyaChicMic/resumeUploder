const joi = require('joi');
const CONST = require('../../utils/constant');
const userControllers = require('../../controller/userController');
const { Query } = require('mongoose');


module.exports = [
    {
        method: "GET",
        path: "/getProfileById/:id",
            joiSchema: {
                params: joi.object({
                    id:joi.string().required(),
                })
            },
        auth: CONST.AUTH_AVAIL,
        handler: userControllers.getProfileDetailsById,
    },
    // {
    //     method: "GET",
    //     path: "/getProfile",
    //     auth: CONST.AUTH_AVAIL,
    //     handler: userControllers.,
    // },
    {
        method: "POST",
        path: "/forgetPassword",
        joiSchema: {
            body: joi.object({
                email:joi.string().email().required(),
            })
        },
        handler:userControllers.forgetPassword
    },
    {
        method: "PUT",
        path: "/updateProfile",
        joiSchema: {
            params: joi.object({
                id: joi.string().required(),
            })
        },
        auth: CONST.AUTH_AVAIL,
        handler: userControllers.updateProfile
    },
    {
        method: "DELETE",
        path: "/deleteProfile",
        joiSchema: {
            params: joi.object({
                id: joi.string().required(),
            })
        },
        auth: CONST.AUTH_AVAIL,
        handler: userControllers.deleteProfileById
    },
    {
        method: "POST",
        path: "/changePassword",
        joiSchema: {
            body: joi.object({
                password:joi.string().required(),
            }),
            Query: joi.object({
                token:joi.string().required()
            })
        },
        handler:userControllers.changePassword,
    }
]