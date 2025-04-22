const { createFailResponse, createSuccessResponseWithStatus } = require("../helper");
const resumeModel = require("../model/resumeModel");
const userModel = require("../model/userModel");
const path = require('path');
const { default: OpenAI } = require('openai');
const { findOneData, updateOneData, findData, lookupData, lookupDataWithPagination } = require("../services/dbServices");
const message = require("../utils/message");
const uploadFilefromUrl = require("../services/fileUploadService");
const { redisClient } = require("../startup/redisStartup");
const CONST = require("../utils/constant");
const transporter1 = require("../services/emailServices");
const pdf = require('pdf-parse');
const fs = require('fs');
const utils = require("../utils/utils");
const { OPENAI_KEY } = require("../../config");
const openai = new OpenAI({
    apiKey: OPENAI_KEY,
    baseURL: 'https://openrouter.ai/api/v1',
});


const resumeController = {};

resumeController.uploadInStorage = async (payload) => {
    const filePath = payload.filePath;
    console.log(filePath);
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
        userId: payload.user.userId,
        resumeUrl,
        fileName,
        fileType
    };

    const doc = new resumeModel(resumeData);
    await doc.save();

    const result = createSuccessResponseWithStatus(message.SUCCESS, resumeData);
    return result;
};

resumeController.getResumeById = async (payload) => {
    const { id } = payload;
    const cacheKey = `${id}`;
    const resume = await findOneData(resumeModel, { _id: id });
    const user = await findOneData(userModel, { _id: payload.user.userId });
    if ((resume.userId.toString() !== payload.user.userId.toString()) && user.role !== "admin") {
        throw createFailResponse(message.FORBIDDEN, "FORBIDDEN")
    }
    if (!resume || resume.isDeleted) {
        throw createFailResponse(message.NOT_FOUND, "NOT_FOUND");
    }
    await redisClient.setEx(cacheKey, CONST.REDIS_TTL, JSON.stringify(resume));
    const result = createSuccessResponseWithStatus(message.SUCCESS, resume);
    return result;
}

resumeController.deleteResumeById = async (payload) => {
    const { id } = payload;
    const cacheKey = `${id}`;
    const resume = await findOneData(resumeModel, { _id: id });
    const user = await findOneData(userModel, { _id: payload.user.userId });
    if ((resume.userId.toString() !== payload.user.userId.toString()) && user.role !== 'admin') {
        throw createFailResponse(message.FORBIDDEN, "FORBIDDEN");
    }
    if (!resume || resume.isDeleted) {
        throw createFailResponse(message.NOT_FOUND, "NOT_FOUND");
    }
    await updateOneData(resumeModel, { userId: payload.id }, { $set: { isDeleted: true } }, { upsert: false });
    await redisClient.del(cacheKey);
    const result = createSuccessResponseWithStatus(message.SUCCESS);
    return result;
}

resumeController.getAllResume = async (payload) => {
    const { page=1, limit=10 } = payload;
    const skip = (page - 1) * limit;
    const resumes = await findData(resumeModel, {}).skip(skip).limit(limit);
    const result = createSuccessResponseWithStatus(message.SUCCESS, resumes);
    return result;
}

resumeController.resumeUploadSuccess = async (payload) => {
    const { email } = payload;

    const user = await findOneData(userModel, { email: email });

    if (!user || user.isDeleted) {
        throw createFailResponse(message.USER_NOT_REGISTERED, "DATA_NOT_FOUND");
    }

    const mailOptions = {
        from: '"Abhishekh kumar" <abhi75191112@gmail.com>',
        to: user.email,
        subject: "Resume Upload Successfully",
        text: "Resume Uploaded",
        html: `<p>Resume Uploaded Successfully</p>`
    };

    try {
        await transporter1.sendMail(mailOptions);
        const result = createSuccessResponseWithStatus(message.SUCCESS);
        return result;
    } catch (err) {
        console.log(err);
        throw createFailResponse(message.FAIL_TO_SEND_EMAIL, "SERVER_ERROR");
    }
}

resumeController.updateResumeById = async (payload) => {
    const data = {};
    const { id } = payload;
    if (payload.resumeUrl) {
        data.resumeUrl = payload.resumeUrl;
    }
    if (payload.fileName) {
        data.fileName = payload.fileName;
    }
    if (payload.fileType) {
        data.fileType = payload.fileType;
    }

    const cacheKey = `${id}`

    const resume = await findOneData(resumeModel, { _id: id });

    if (resume.userId.toString() !== payload.user.userId.toString()) {
        throw createFailResponse(message.FORBIDDEN, "FORBIDDEN");
    }
    if (!resume || resume.isDeleted) {
        throw createFailResponse(message.NOT_FOUND, "DATA_NOT_FOUND");
    }
    await redisClient.del(cacheKey);
    await updateOneData(resumeModel, { userId: payload.user.userId }, { $set: data }, { upsert: false });
    const result = createSuccessResponseWithStatus(message.SUCCESS, "SUCCESS");
    return result;
}

resumeController.uploadfileFormUrl = async (payload) => {
    const { url } = payload;
    if (!utils.checkUrl(url)) {
        throw createFailResponse(message.INVAILD_URL, "BAD_REQUEST");
    }
    const dirPath = path.join(__dirname, '../../uploadFile/fromUrls');
    try {
        await uploadFilefromUrl(url, dirPath);
        const result = createSuccessResponseWithStatus(message.FILE_DOWNLOAD);
        return result;
    } catch (error) {
        throw createFailResponse(error.message, "SERVER_ERROR")
    }
};

resumeController.getAlltextFromPdf = async (payload) => {
    const filePath = payload.filePath;

    if (!filePath) {
        throw createFailResponse(message.FILE_REQUIRED, "BAD_REQUEST");
    }
    try {
        let fileError, filedata;
        const dataBuffer = fs.readFileSync(path.join(__dirname, `../../${filePath.path}`));
        await pdf(dataBuffer).then((data) => {
            filedata = JSON.parse(JSON.stringify(data.text));
        }).catch((err) => {
            console.log(err);
            fileError = err.message;
        })
        if (fileError) {
            throw createFailResponse(fileError, "SERVER_ERROR")
        }
        const result = createSuccessResponseWithStatus(message.SUCCESS, filedata);
        return result;
    } catch (err) {
        throw createFailResponse(err.message, "SERVER_ERROR");
    }
}

resumeController.evaluateResume = async (payload) => {
    const { resumeText } = payload;
    if (!resumeText) {
        throw createFailResponse(message.RESUME_TEXT_REQUIRE, "BAD_REQUEST");
    }

    const prompt = `
        You are a professional resume reviewer. Analyze the resume text provided and return a
        JSON with the following:
        {
            "score": number,
            "strengths": [],
            "weaknesses": [],
            "suggestions": [],
            "grammarIssues": []
        }

        Resume:${resumeText}`;
    try {
        const response = JSON.parse(JSON.stringify(await openai.chat.completions.create({
            model: 'arliai/qwq-32b-arliai-rpr-v1:free', 
            messages: [
                { role: 'system', content: 'You are a resume evaluator.' },
                { role: 'user', content: prompt }
            ]
        })));
        
        const evaluation = response.choices[0].message.content;
        const result = createSuccessResponseWithStatus(message.SUCCESS, evaluation);
        return result;
    } catch (error) {
        console.error(error);
        throw createFailResponse(message.EVALUATE_FAIL, "SERVER_ERROR");
    }

}

resumeController.viewResumeOfUserById = async (payload) => {
    const { id, page = 1, limit = 10 } = payload;
    const skip = (page - 1) * limit;

    const resumes = await lookupDataWithPagination(
        userModel,
        'resumes',  
        '_id',
        'userId',
        'resumes',
        id,
        +skip,
        +limit
    );

    const result = createSuccessResponseWithStatus(message.SUCCESS, resumes);
    return result;
};

module.exports = resumeController;