const { createClient } = require('redis');
const { REDIS_URL } = require('../../config');

const redisClient = createClient({
    url:REDIS_URL
})

const redisConnection=async () => {
    try {
        await redisClient.connect();
        console.log('Redis connected');
    } catch (err) {
        
    }
}

module.exports={redisClient,redisConnection}