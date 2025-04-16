const bcrypt = require('bcryptjs'); // or 'bcrypt' if you're using that package
const constants=require('./constant')
const jwt= require('jsonwebtoken')
const utils = {};

//function for hash 
utils.hashPassword = (payloadString) => { return bcrypt.hashSync(payloadString, constants.SALT) };

//function for compare hash
utils.compareHash = (payloadPassword, userPassword) => bcrypt.compareSync(payloadPassword, userPassword);

//encrypt payloads

utils.encryptJwt = (payload,key, expTime = '1m') => jwt.sign(payload, key, { algorithm: 'HS256', expiresIn: expTime });

//decryptJwt payloads

utils.decryptJwt = (token,key) => jwt.verify(token, key, { algorithm: 'HS256' });

module.exports = utils;