const helpers = require("../helper");
const userModel = require("../model/userModel");
const message = require("../utils/message");
const utils = require("../utils/utils");
const dbServices = require("./dbServices");

const authService = {};

authService.authenticateUser = () => async(req, res, next) => {

    let token = req.header("Authorization");

    if (!token) {
        return res.status(400).json({ msg: "token is not given" });
    }
    try {
        let result = utils.decryptJwt(token);
        const user = await dbServices.findOneData(userModel, { _id: result.userId });
        if (!user || (user && user.isDeleted)) {
            return res.status(404).json({ msg: message.USER_NOT_REGISTERED });
        }
        req.user = result;
        next();
    }
    catch (err) {
        res.status(401).json({msg:"unauthorized"})
    }
}

module.exports = authService;
