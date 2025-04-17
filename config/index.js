
require('dotenv').config();

module.exports = {
    PORT: process.env.PORT,
    URL: process.env.URL,
    REDIS_URL: process.env.REDIS_URL,
    JWT_ACCESS_KEY: process.env.JWT_ACCESS_KEY,
    JWT_REFRESS_KEY: process.env.JWT_REFRESS_KEY,
    OPENAI_KEY:process.env.OPENAI_KEY
}