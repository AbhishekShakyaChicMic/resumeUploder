const redisMiddleware = require("../middleware/redisMiddleware");
const roleCheck = require("../middleware/roleMiddleware");
const uploadMiddleware = require("../middleware/uploadMiddleware");
const authService = require("../services/authServices");
const message = require("./message");

const routeUtils = {};


routeUtils.route = async(app, routes) => {
    routes.forEach((route) => {
        const middlewares = [];
        if (route.joiSchema) {
            middlewares.push(vaildateJoiSchema(route));
        }
        if (route.auth) {
            middlewares.push(authService.authenticateUser());
        }
        if (route.roles) {
            middlewares.push(roleCheck.roleMiddleware(route.roles));
        }
        if (route.redis) {
            middlewares.push(redisMiddleware.cacheMiddleware());
        }
        if (route.upload) {
            middlewares.push(uploadMiddleware.uploadFile());
        }
        app.route(route.path)[route.method.toLowerCase()](...middlewares,getHandlerMethod(route));
    });
}

const checkJoiValidation = (schema, payload, res) => {
    const { error, value } = schema.validate(payload);

    if (error) {
        console.log(JSON.stringify(error));
        throw res.status(400).json({ "Error": error.message });
    }
    return value;
}

const vaildateJoiSchema = (route) => (req, res, next) => {
    if (route.joiSchema.body && Object.keys((route.joiSchema.body || {}))?.length) {
        req.body = checkJoiValidation(route.joiSchema.body, req.body, res);
    }
    if (route.joiSchema.params && Object.keys((route.joiSchema.params || {}))?.length) {
        req.params = checkJoiValidation(route.joiSchema.params, req.params, res);
    }
    if (route.joiSchema.query && Object.keys((route.joiSchema.query || {}))?.length) {
        req.query = checkJoiValidation(route.joiSchema.query, req.query, res);
    }

    next();
}


const getHandlerMethod = (route) => {
    const { handler } = route;
    return (req, res) => {
        const payload = {
            ...(req.body || {}),
            ...(req.params || {}),
            ...(req.query || {}),
            user: (req.user || {}),
            filePath:(req.filePath||{})
        };


        handler(payload).then((result) => {
            if (result?.data?.refreshToken) {
                res.cookie('refreshToken', result.data.refreshToken, {
                    httpOnly: true,
                    secure: true,      
                    sameSite: 'Strict',
                    maxAge: 1 * 24 * 60 * 60 * 1000
                });
            }
            if (result?.data?.accessToken) {
                return res.status(result.statusCode).json({status:result.status,statusCode:result.statusCode,message:result.message,type:result.type,token:result.data.accessToken});
            }
            if (result?.data?.filePath) {
                const filePath = path.resolve(`${__dirname}/../${result?.data?.filePath}`);
                return res.status(result.statusCode).sendFile(filePath);
            }
            if (result?.fileData) {
                res.attachment(result.fileName);
                res.send(result.fileData.Body);
                return res;
            }
            if (result?.redirectUrl) {
                return res.redirect(result.redirectUrl);
            }
            else if (result?.statusCode) {
                return res.status(result?.statusCode).json(result);
            } else {
                return res.json(result);
            }
        }).catch((err) => {
            console.log('Error is ', err);
            res.status(err.statusCode).json(err);
        })
    }
}

module.exports = routeUtils;