const message = require("../../utils/message");

const RESPONSE = {
    ERROR: {
        BAD_REQUEST: (data, msg) => {
            let obj = {
                status: false,
                statusCode: 400,
                message: msg || '',
                type: "BAD_REQUEST"
            };
            if (data) {
                obj = { ...obj, ...data };
            }
            return obj;
        },
        DATA_NOT_FOUND: (data, msg) => {
            let obj = {
                status: false,
                statusCode: 404,
                message: msg || '',
                type:"DATA_NOT_FOUND",
            }
            if (data) {
                obj = { ...obj, ...data };
            }
            return obj;
        },
        ALREADY_EXISTS: (data, msg) => {
            let obj={
                status: false,
                statusCode: 400,
                message: msg || '',
                type:"ALREADY_EXISTS",
            }
            if (data) {
                obj = { ...obj, ...data };
            }
            return obj;
        },
        FORBIDDEN: (data, msg) => {
            let obj = {
                status: false,
                statusCode: 401,
                message: msg || '',
                type: "FORBIDDEN",
            }
            if (data) {
                obj = { ...obj, ...data };
            }
            return obj;
        },
        SERVER_ERROR: (data, msg) => {
            let obj = {
                status: false,
                statusCode: 500,
                message: msg || '',
                type: "SERVER ERROR"
            };
            if (data) {
                obj = { ...obj, ...data };
            }
            return obj;
        }
    },
    SUCCESS: {
        MISSCELANEOUSAPI:(data,msg)=> {
            let obj = {
                status: true,
                statusCode: 200,
                message: msg || '',
                type:"SUCCESS"
            };
            if(data) {
                obj = { ...obj, ...data };
            }
            return obj;
        },
        WITHOUTSTATUS: (data) => {
            let obj = {};
            if (data) {
                obj = { ...data };
            }
            return obj;
        }
    }
}

function createSuccessResponseWithStatus(msg, data) {
    return RESPONSE.SUCCESS.MISSCELANEOUSAPI(data, msg);
}

function createSuccessResponseWithoutStatus(msg, data) {
    return RESPONSE.SUCCESS.WITHOUTSTATUS(data, msg);
}

function createFailResponse(msg, error_type, data) {
    console.log(msg, error_type, data);
    return RESPONSE.ERROR[error_type](data,msg);
}

module.exports = {
    createSuccessResponseWithStatus,
    createSuccessResponseWithoutStatus,
    createFailResponse,
}
