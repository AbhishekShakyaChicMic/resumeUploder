const { createSuccessResponseWithStatus, createFailResponse } = require("../helper");
const message = require('../utils/message');
const userModel = require("../model/userModel");
const dbServices = require("../services/dbServices");
const utils = require("../utils/utils");


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
    
    const accessToken = utils.encryptJwt({userId:user._id}, '1m');
    const refreshToken = utils.encryptJwt({ userId: user._id }, '1d');
    
    const data = {
        accessToken,
        refreshToken
    }
    
    const result = createSuccessResponseWithStatus(message.LOGIN, data);
    return result;
}

module.exports = authControllers;