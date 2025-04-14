require('dotenv').config();

module.exports = {
    PORT: process.env.PORT,
    URL: process.env.URL,
    REDIS_URL:process.env.REDIS_URL,
}