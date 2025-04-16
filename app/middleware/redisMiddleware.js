const { redisClient } = require("../startup/redisStartup");

const redisMiddleware = {};

redisMiddleware.cacheMiddleware = () =>
    async (req, res, next) => {
        const { id } = req.params;
        try {
            const data = '';
            if (req.query.page) data += `?page=${req.query.page}`;
            if (req.query.limit) data += `&limit=${req.query.limit}`;
            const cacheKey = `${id}` + data;
            const cacheData =await redisClient.get(cacheKey);
            if (cacheData) {
                const sendData = {
                    datafromCache: true,
                    status: true,
                    statusCode: 200,
                    message: "Success",
                    type: "SUCCESS",
                    data: JSON.parse(cacheData),
                }
                return res.json(sendData);
            }
            next();
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    }

module.exports = redisMiddleware; const { createSuccessResponseWithStatus } = require("../helper");