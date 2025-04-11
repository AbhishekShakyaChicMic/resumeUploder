const bcrypt = require('bcryptjs'); // or 'bcrypt' if you're using that package
const constants=require('./constant')
const jwt= require('jsonwebtoken')
const utils = {};

//function for hash 
utils.hashPassword = (payloadString) => { return bcrypt.hashSync(payloadString, constants.SALT) };

//function for compare hash
utils.compareHash = (payloadPassword, userPassword) => bcrypt.compareSync(payloadPassword, userPassword);

//encrypt payloads

utils.encryptJwt = (payload, expTime = '1m') => jwt.sign(payload, constants.JWT_SIGN_KEY, { algorithm: 'HS256', expiresIn: expTime });

//decryptJwt payloads

utils.decryptJwt = (token) => jwt.verify(token, constants.JWT_SIGN_KEY, { algorithm: 'HS256' });

//generate otp
utils.generateOTP = () => {
    const length = 6;
    let chars = "1234567890"

    let otp = "";
    for (let i = 0; i < length; i++) {
        const randIdx = Math.floor(Math.random() * chars.length);
        otp += chars[randIdx];
    }
    return otp;
}

module.exports = utils;