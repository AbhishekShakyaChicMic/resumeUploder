const authService = require("../services/authServices");

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
        };


        handler(payload).then((result) => {
            if (result.refreshToken) {
                res.cookie('refreshToken', result.refreshToken, {
                    httpOnly: true,
                    secure: true,      // only over HTTPS
                    sameSite: 'Strict', // or 'Lax' / 'None'
                    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
                });
            }
            if (result.accessToken) {
                return res.status(result.statusCode).json({msg:result.status,token:result.accessToken});
            }
            if (result.statusCode) {
                return res.status(result.statusCode).json(result);
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