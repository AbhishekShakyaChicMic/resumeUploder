const { createSuccessResponseWithStatus, createFailResponse } = require("../helper");
const message = require('../utils/message');
const userModel = require("../model/userModel");
const dbServices = require("../services/dbServices");
const utils = require("../utils/utils");
const transporter1 = require("../services/emailServices");
const { redisClient } = require("../startup/redisStartup");
const CONST = require("../utils/constant");
const { v4: uuidv4 } = require('uuid');
const { JWT_REFRESS_KEY, JWT_ACCESS_KEY } = require("../../config");

const userControllers = {};

userControllers.getProfileDetailsById = async (payload) => {
    const { id } = payload;

    const user1 = await dbServices.findOneData(userModel, { _id: payload.user.userId });

    //compair provided userId to Auth validate userId if both is not same and user not admin then throw error
    if ((id.toString() !== payload.user.userId.toString()) && user1.role !== 'admin') {
        throw createFailResponse(message.FORBIDDEN, "FORBIDDEN");
    }

    const user = await dbServices.findOneData(userModel, { _id: id });

    //Extract require data from user and send as a responce
    const data = {
        name: user.name,
        email: user.email,
        mobile: user.mobile,
    }

    //make redis key and store in redis database
    const cacheKey = `${id}`;
    await redisClient.setEx(cacheKey, CONST.REDIS_TTL, JSON.stringify(data));

    const result = createSuccessResponseWithStatus(message.SUCCESS, data);
    return result;
}

userControllers.updateProfile = async (payload) => {
    //Collect data that requested by user to updat 
    const data = {};
    if (payload.name) {
        data.name = payload.name;
    }
    if (payload.mobile) {
        data.mobile = payload.mobile;
    }

    const cacheKey = `${id}`;

    //update data in data base as per user requiest
    const feedBack = await dbServices.updateOneData(userModel, { _id: payload.user.userId }, { $set: data }, { upsert: false });
    if (feedBack.matchedCount === 0) {
        throw createFailResponse(message.NOT_FOUND, "NOT_FOUND");
    }

    //deleted store data from cache memory
    await redisClient.del(cacheKey);
    
    const result = createSuccessResponseWithStatus(message.SUCCESS);
    return result;
}

userControllers.deleteProfileById = async (payload) => {

    const { id } = payload;

    //redis key for Store profile data
    const cacheKey = `${id}`

    const user = await dbServices.findOneData(userModel, { _id: payload.user.userId });

    //check the user is valid if not then it is not admin
    if ((id.toString() !== payload.user.userId.toString()) && user.role !== 'admin') {
        throw createFailResponse(message.FORBIDDEN, "FORBIDDEN");
    }

    const feedBack = await dbServices.updateOneData(userModel, { _id: id }, { $set: { isDeleted: true } }, { upsert: false });
    if (feedBack.matchedCount === 0) {
        throw createFailResponse(message.NOT_FOUND, "NOT_FOUND");
    }

    //deleted data from  redis database
    await redisClient.del(cacheKey);

    const result = createSuccessResponseWithStatus(message.SUCCESS);
    return result;
}

userControllers.forgetPassword = async (payload) => {
    const { email } = payload;
    try {
        const user = await dbServices.findOneData(userModel, { email: email });

        //check user exists or not
        if (!user || user.isDeleted) {
            throw createFailResponse(message.USER_NOT_REGISTERED, "DATA_NOT_FOUND");
        }

        const token = utils.encryptJwt({ userId: user._id }, '5m');

        //server url where backend code is hosted
        const resetURL = `http://localhost:5555/changePassword?token=${token}`;

        //send this data to user email
        const mailOptions = {
            from: 'abhi75191112@gmail.com',
            to: email,
            subject: "ToReset Password",
            text: resetURL,
            html: `<p>Click the link below to reset your password:</p>
           <a href="${resetURL}">${resetURL}</a>`,
        };
        await transporter1.sendMail(mailOptions);

        const result = createSuccessResponseWithStatus(message.SUCCESS);
        return result;
    } catch (err) {
        throw createFailResponse(err.message, "SERVER_ERROR")
    }
}

userControllers.changePassword = async (payload) => {
    const { password, token } = payload;

    //check Token is given or not 
    if (!token) {
        throw createFailResponse(message.TOKEN_NOT_AVAIL, "DATA_NOT_FOUND");
    }

    try {
        const ans = await utils.decryptJwt(token);

        //Hash the password that provided by user
        const pass = await utils.hashPassword(password);

        //update password in database
        const feedBack = await dbServices.updateOneData(userModel, { _id: ans.userId }, { $set: { password: pass } }, { upsert: false });
        if (feedBack.matchedCount === 0) {
            throw createFailResponse(message.NOT_FOUND, "DATA_NOT_FOUND");
        }

        const result = createSuccessResponseWithStatus(message.CHANGE_PASSWORD);
        return result;
    } catch (err) {
        throw createFailResponse(message.P, "SERVER_ERROR");
    }
}

userControllers.getAllUserProfile = async (payload) => {

    const { page, limit } = payload;
    try {
        const skip = (page - 1) * limit;
        const users = await dbServices.findData(userModel, {}).skip(skip).limit(limit);
        const result = createSuccessResponseWithStatus(message.SUCCESS, users);
        return result;
    } catch (err) {
        throw createFailResponse(err.message, 'SERVER_ERROR');
    }
}

userControllers.createNewRefreshToken = async (payload) => {
    const { token } = payload;
    try {
        //verify the refresh token
        const verify = await utils.decryptJwt(token, JWT_REFRESS_KEY);

        //find user used the refresh token
        const user = await dbServices.findOneData(userModel, { _id: verify.userId });

        //check user exists if exists then is deleted or not
        if (!user || user.isDeleted) {
            throw createFailResponse(message.USER_NOT_REGISTERED, "DATA_NOT_FOUND");
        }

        //make access token and give it back to user
        const accessToken = await utils.encryptJwt({ userId: user._id, date: uuidv4() }, JWT_ACCESS_KEY, "1h");

        const data = {
            accessToken
        }

        const result = createSuccessResponseWithStatus(message.NEW_TOKEN, data);
        return result;
    } catch (err) {
        throw createFailResponse(err.message, "SERVER_ERROR");
    }
}

userControllers.logoutController = async (payload) => {
    const id = payload.user.userId;
    try {
        //Redis key that store in redis database
        const cacheKey = `${id}` + 'refreshToken';
        console.log(cacheKey);
        //delete refresh token that is store in redis database
        await redisClient.del(cacheKey);

        const exist = await redisClient.get(cacheKey);
        console.log("Just saved?", exist); // Should show the hashed value

        //Send success response
        const exists = await redisClient.get(cacheKey);
        console.log("Just saved?", exists); // Should show the hashed value

        const result = createSuccessResponseWithStatus(message.LOGOUT_SUCCESS, "SUCCESS");
        return result;
        
    } catch (err) {
        throw createFailResponse(err.message,"SERVER_ERROR")
    }
}

module.exports = userControllers;