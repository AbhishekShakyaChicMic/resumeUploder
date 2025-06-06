const joi = require('joi');
const { uploadResume, uploadInStorage, getResumeById, deleteResumeById, getAllResume, resumeUploadSuccess, updateResumeById, uploadfileFormUrl, getAlltextFromPdf, evaluateResume, viewResumeOfUserById } = require('../../controller/resumeController');
const { Query } = require('mongoose');
const CONST = require('../../utils/constant');


module.exports = [
    {
        method: "POST",
        path: "/v1/uploadResume",
        joiSchema: {
            body: joi.object({
                resumeUrl: joi.string().required(),
                fileName: joi.string().required(),
                fileType:joi.string().required(),
            }),
        },
        auth: CONST.AUTH_AVAIL,
        handler: uploadResume,
    },
    {
        method: "POST",
        path: "/v1/upload",
        auth: CONST.AUTH_AVAIL,
        upload:CONST.UPLOAD_AVAIL,
        handler: uploadInStorage,
    },
    {
        method: "get",
        path: "/v1/getResumeById/:id",
        joiSchema: {
            params: joi.object({
                id: joi.string().required(),
            }),
        },
        redis: CONST.REDIS_AVAIL,
        auth: CONST.AUTH_AVAIL,
        handler: getResumeById,
    },
    {
        method: "DELETE",
        path: "/v1/deleteResumeById/:id",
        joiSchema: {
            params: joi.object({
                id: joi.string().required(),
            }),
        },
        auth: CONST.AUTH_AVAIL,
        handler: deleteResumeById,
    },
    {
        method: "GET",
        path: "/v1/getAllResume",
        joiSchema: {
            Query: joi.object({
                page: joi.string().required(),
                limit: joi.string().required(),
            }),
        },
        role: ['admin'],
        auth: CONST.AUTH_AVAIL,
        handler: getAllResume,
    },
    {
        method: "POST",
        path: "/v1/uploadResumeSuccess",
        joiSchema: {
            body: joi.object({
                email: joi.string().email().required(),
            }),
        }, redis: CONST.REDIS_AVAIL,
        auth: CONST.AUTH_AVAIL,
        handler: resumeUploadSuccess,
    },
    {
        method: "PUT",
        path: "/v1/updateResumeById/:id",
        joiSchema: {
            body: joi.object({
                resumeUrl: joi.string(),
                fileName: joi.string(),
                fileType: joi.string(),
            }),
            params: joi.object({
                id: joi.string().required(),
            })
        },
        auth: CONST.AUTH_AVAIL,
        handler: updateResumeById,
    },
    {
        method: "POST",
        path: "/v1/uploadfileFormUrl",
        joiSchema: {
            Query: joi.object({
                url: joi.string().required(),
            })
        },
        auth: CONST.AUTH_AVAIL,
        handler: uploadfileFormUrl,
    },
    {
        method: "GET",
        path: "/v1/getFileTextData",
        upload: CONST.UPLOAD_AVAIL,
        auth: CONST.AUTH_AVAIL,
        handler: getAlltextFromPdf,
    },
    {
        method: "GET",
        path: "/v1/evaluateResume",
        joiSchema: {
            body: joi.object({
                resumeText: joi.string().required(),
            })
        },
        auth: CONST.AUTH_AVAIL,
        handler: evaluateResume,
    },
    {
        method: "GET",
        path: "/v1/ResumeListOfUser/:id",
        joiSchema: {
            parms: joi.object({
                id: joi.string().required(),
            }),
            Query: joi.object({
                page: joi.string().required(),
                limit: joi.string().required(),
            }),
        },
        //role: ['admin'],
        auth: CONST.AUTH_AVAIL,
        handler: viewResumeOfUserById,
    },
]