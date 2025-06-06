const joi = require('joi');
const CONST = require('../../utils/constant');
const userControllers = require('../../controller/userController');


module.exports = [
    {
        method: "GET",
        path: "/v1/getProfileById/:id",
        joiSchema: {
            params: joi.object({
                id: joi.string().required(),
            })
        },
        redis: CONST.REDIS_AVAIL,
        auth: CONST.AUTH_AVAIL,
        handler: userControllers.getProfileDetailsById,
    },
    {
        method: "GET",
        path: "/v1/getAllProfile",
        joiSchema: {
            query: joi.object({
                page: joi.string().required(),
                limit: joi.string().required(),
            })
        },
        roles: ["admin"],
        auth: CONST.AUTH_AVAIL,
        handler: userControllers.getAllUserProfile,
    },
    {
        method: "POST",
        path: "/v1/forgetPassword",
        joiSchema: {
            body: joi.object({
                email: joi.string().email().required(),
            })
        },
        handler: userControllers.forgetPassword
    },
    {
        method: "PUT",
        path: "/v1/updateProfile/:id",
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
        path: "/v1/deleteProfileById/:id",
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
        path: "/v1/changePassword",
        joiSchema: {
            body: joi.object({
                password: joi.string().required(),
            }),
            Query: joi.object({
                token: joi.string().required()
            })
        },
        handler: userControllers.changePassword,
    },
    {
        method: "POST",
        path: "/v1/refreshToken",
        joiSchema: {
            Query: joi.object({
                token: joi.string().required()
            })
        },
        handler: userControllers.createNewRefreshToken,
    },
    {
        method: "POST",
        path: "/v1/logout",
        auth: CONST.AUTH_AVAIL,
        handler: userControllers.logoutController,
    }
]