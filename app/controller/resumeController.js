const { createFailResponse, createSuccessResponseWithStatus } = require("../helper");
const resumeModel = require("../model/resumeModel");
const userModel = require("../model/userModel");
const { findOneData, updateOneData, findData } = require("../services/dbServices");
const { transporter } = require("../services/emailServices");
const message = require("../utils/message");
const userControllers = require("./userController");


const resumeController = {};

resumeController.uploadResume = async (payload) => {
    
};

resumeController.getResumeById=async (payload) => {
    const resume = await findOneData(resumeModel, { userId: payload.id });
    const user = await findOneData(userModel, { _id: payload.user.userId });
    if ((resume.userId.toString() !== payload.user.userId.toString())&& user.role!=="admin") {
        throw createFailResponse(message.FORBIDDEN,"FORBIDDEN")
    }
    if (!resume || resume.isDeleted) {
        throw createFailResponse(message.NOT_FOUND,"NOT_FOUND");
    }
    const result = createSuccessResponseWithStatus();
    return result;
}

resumeController.deleteResumeById = async (payload) => {
    const resume = await findOneData(resumeModel, { userId: payload.id });
    const user = await findOneData(userControllers, { _id: payload.user.userId });
    if ((resume.userid.toString() !== payload.user.userId.toString()) && user.role !== 'admin') {
        throw createFailResponse(message.FORBIDDEN, "FORBIDDEN");
    }
    if (!resume || resume.isDeleted) {
        throw createFailResponse(message.NOT_FOUND, "NOT_FOUND");
    }
    await updateOneData(resumeModel, { userId: payload.id }, { $set: data }, { upsert: false });

    const result = createSuccessResponseWithStatus(message.SUCCESS);
    return result;
}

resumeController.getAllResume=async (payload) => {
    const { page, limit } = payload;
    const skip = (page - 1) * limit;
    const resumes = await findData(resumeModel, {}).skip(skip).limit(limit);
    const result = createSuccessResponseWithStatus(message.SUCCESS, resumes);
    return result;
}

resumeController.resumeUploadSuccess=async (payload) => {
    const { email } = payload;

    const user = await dbServices.findOneData(userModel, { email: email });
    
    if (!user || user.isDeleted) {
        throw createFailResponse(message.USER_NOT_REGISTERED, "DATA_NOT_FOUND");
    }

    const mailOptions = {
        from: '"Abhishekh kumar" <abhi75191112@gmail.com>',
        to:user.email,      
        subject:"Resume Upload Successfully", 
        text:"Resume Uploaded",    
        html :`<p>Resume Uploaded Successfully</p>`
    };

    try {
        await transporter.sendMail(mailOptions);
        const result = createSuccessResponseWithStatus(message.SUCCESS);
        return result;
    } catch (err) {
        throw createFailResponse(message.FAIL_TO_SEND_EMAIL);
    }
}

module.exports = resumeController;