const userModel = require("../model/userModel");
const { findOneData } = require("../services/dbServices");
const message = require("../utils/message");


const roleCheck = (roles) => {
    async (req, res, next) => {
        try {
            const id = req.user.userId;
            const user = await findOneData(userModel, { _id: id });
            if (!roles.includes(user.role)) {
                return res.status(401).json({ msg: message.FORBIDDEN });
            }
            next();
        } catch (err) {
            return res.status(401).json({ msg: "unauthorized" })
        }
    }
}

module.exports = roleCheck;