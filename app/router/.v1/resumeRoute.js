const joi = require('joi');
const { uploadResume, uploadInStorage, getResumeById, deleteResumeById, getAllResume, resumeUploadSuccess, updateResumeById, uploadfileFormUrl } = require('../../controller/resumeController');
const { Query } = require('mongoose');
const CONST = require('../../utils/constant');


module.exports = [
    {
        method: "POST",
        path: "/uploadResume",
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
        path: "/upload",
        auth: CONST.AUTH_AVAIL,
        upload:CONST.UPLOAD_AVAIL,
        handler: uploadInStorage,
    },
    {
        method: "get",
        path: "/getResumeById/:id",
        joiSchema: {
            params: joi.object({
                id: joi.string().required(),
            }),
        },
        auth: CONST.AUTH_AVAIL,
        handler: getResumeById,
    },
    {
        method: "DELETE",
        path: "/deleteResumeById/:id",
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
        path: "/getAllResume",
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
        path: "/uploadResumeSuccess",
        joiSchema: {
            body: joi.object({
                email: joi.string().email().required(),
            }),
        },
        auth: CONST.AUTH_AVAIL,
        handler: resumeUploadSuccess,
    },
    {
        method: "PUT",
        path: "/updateResumeById/:id",
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
        path: "/uploadfileFormUrl",
        joiSchema: {
            Query: joi.object({
                url: joi.string().required(),
            })
        },
        auth: CONST.AUTH_AVAIL,
        handler: uploadfileFormUrl,
    },
]