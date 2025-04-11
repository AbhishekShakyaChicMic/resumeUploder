const { createSuccessResponseWithStatus, createFailResponse } = require("../helper");
const message = require('./../utils/message');
const userModel = require("../model/userModel");
const dbServices = require("../services/dbServices");
const utils = require("../utils/utils");


const userControllers = {};

userControllers.hello = async (payloads) => {
    const result = createSuccessResponseWithStatus(message.HELLO);
    return result;
}

userControllers.signup = async (payload) => {
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

userControllers.login = async (payload) => {
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

userControllers.getProfileDetails = async (payload) => {
    const { id } = payload;

    if (id.toString() !== payload.user.userId.toString()) {
        throw createFailResponse(message.FORBIDDEN, "FORBIDDEN");
    }
    const user = await dbServices.findOneData(userModel, { _id: id });

    const data = {
        name: user.name,
        email: user.email,
        mobile: user.mobile,
    }
    const result = createSuccessResponseWithStatus(message.SUCCESS, data);
    return result;
}

module.exports = userControllers;