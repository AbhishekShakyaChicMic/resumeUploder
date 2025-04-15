const { createFailResponse, createSuccessResponseWithStatus } = require("../helper");
const resumeModel = require("../model/resumeModel");
const userModel = require("../model/userModel");
const path = require('path');
const { findOneData, updateOneData, findData } = require("../services/dbServices");
const { transporter } = require("../services/emailServices");
const message = require("../utils/message");
const uploadFilefromUrl = require("../services/fileUploadService");


const resumeController = {};

resumeController.uploadInStorage=async (payload) => {
    const filePath = payload.filePath;
    if (!filePath) {
        throw createFailResponse(message.FILE_REQUIRED, "BAD_REQUEST");
    }
    const result = createSuccessResponseWithStatus(message.SUCCESS, filePath);
    return result;
}

resumeController.uploadResume = async (payload) => {
    const { resumeUrl, fileName, fileType } = payload;

    const user = await findOneData(userModel, { _id: payload.user.userId });

    if (!user || user.isDeleted) {
        throw createFailResponse(message.USER_NOT_REGISTERED, "DATA_NOT_FOUND");
    }

    const resumeData = {
        userId:payload.user.userId,
        resumeUrl,
        fileName,
        fileType
    };

    await updateOneData(resumeModel, { userId: payload.user.userId }, { $set: resumeData }, { upsert: true });

    const result = createSuccessResponseWithStatus(message.SUCCESS, resumeData);
    return result;
};

resumeController.getResumeById = async (payload) => {
    const { id } = payload;
    const resume = await findOneData(resumeModel, { _id: id });
    const user = await findOneData(userModel, { _id: payload.user.userId });
    if ((resume.userId.toString() !== payload.user.userId.toString())&& user.role!=="admin") {
        throw createFailResponse(message.FORBIDDEN,"FORBIDDEN")
    }
    if (!resume || resume.isDeleted) {
        throw createFailResponse(message.NOT_FOUND,"NOT_FOUND");
    }
    const result = createSuccessResponseWithStatus(message.SUCCESS,resume);
    return result;
}

resumeController.deleteResumeById = async (payload) => {
    const resume = await findOneData(resumeModel, { userId: payload.id });
    const user = await findOneData(userModel, { _id: payload.user.userId });
    if ((resume.userId.toString() !== payload.user.userId.toString()) && user.role !== 'admin') {
        throw createFailResponse(message.FORBIDDEN, "FORBIDDEN");
    }
    if (!resume || resume.isDeleted) {
        throw createFailResponse(message.NOT_FOUND, "NOT_FOUND");
    }
    await updateOneData(resumeModel, { userId: payload.id }, { $set: {isDeleted:true}}, { upsert: false });

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

resumeController.updateResumeById=async (payload) => {
    const data = {};
    if (payload.resumeUrl) {
        data.resumeUrl = payload.resumeUrl;
    }
    if (payload.fileName) {
        data.fileName = payload.fileName;
    }
    if (payload.fileType) {
        data.fileType = payload.fileType;
    }
    const resume = await findOneData(resumeModel, { _id: payload.id });
    
    if (resume.userId.toString() !== payload.user.userId.toString()) {
        throw createFailResponse(message.FORBIDDEN, "FORBIDDEN");
    }
    if (!resume || resume.isDeleted) {
        throw createFailResponse(message.NOT_FOUND, "DATA_NOT_FOUND");
    }
    await updateOneData(resumeModel, { userId: payload.user.userId }, { $set: data }, { upsert: false });
    const result = createSuccessResponseWithStatus(message.SUCCESS, "SUCCESS");
    return result;
}

resumeController.uploadfileFormUrl = async (payload) => {
    const { url } = payload;
    const dirPath = path.join(__dirname, '../../uploadFile/fromUrls');

    try {
        await uploadFilefromUrl(url, dirPath);
        const result = createSuccessResponseWithStatus(message.FILE_DOWNLOAD);
        return result;
    } catch (error) {
        throw createFailResponse(error.message,"SERVER_ERROR")
    }
};

module.exports = resumeController;