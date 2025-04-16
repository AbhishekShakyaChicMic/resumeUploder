const { createSuccessResponseWithStatus, createFailResponse } = require("../helper");
const message = require('../utils/message');
const userModel = require("../model/userModel");
const dbServices = require("../services/dbServices");
const utils = require("../utils/utils");
const { redisClient } = require("../startup/redisStartup");
const { v4: uuidv4 } = require('uuid');
const { JWT_ACCESS_KEY, JWT_REFRESS_KEY } = require("../../config");

const authControllers = {};

authControllers.signup = async (payload) => {
    const { name, email, password, mobile } = payload;
    
    const user =await dbServices.findOneData(userModel,{email:email})
    
    if (user && user.isDeleted !== true) {
        throw createFailResponse(message.USERID_ALREADY_EXISTS, "ALREADY_EXISTS");
    }
    const hash = await utils.hashPassword(password);
    await dbServices.updateOneData(userModel, { email: email }, { name, email, password: hash, mobile, isDeleted:false }, { upsert: true });
    
    const result = createSuccessResponseWithStatus(message.USER_REGISTERED, payload);
    return result;
}

authControllers.login = async (payload) => {
    const { email, password } = payload;
    const user = await dbServices.findOneData(userModel, { email: email });
    if (!user || user.isDeleted) {
        throw createFailResponse(message.USER_NOT_REGISTERED, "DATA_NOT_FOUND");
    }
    if (!await utils.compareHash(password, user.password)) {
        throw createFailResponse(message.WRONG_PASSWORD, "FORBIDDEN");
    }
    
    const cacheKey = `${user._id}` + 'refreshToken';
    const accessToken = utils.encryptJwt({ userId: user._id, date: uuidv4() },JWT_ACCESS_KEY, '20m');
    const refreshToken = utils.encryptJwt({ userId: user._id,date:uuidv4()},JWT_REFRESS_KEY, '1d');
    
    const data = {
        accessToken,
        refreshToken
    }

    const hashedToken = await utils.hashPassword(refreshToken);

    await redisClient.setEx(cacheKey, 60 * 60 * 24 * 1, hashedToken);
    
    const result = createSuccessResponseWithStatus(message.LOGIN, data);
    return result;
}

module.exports = authControllers;