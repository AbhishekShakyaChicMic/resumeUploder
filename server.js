const express = require('express');
const mongoose = require('mongoose');
const { PORT } = require('./config');
const { redisConnection } = require('./app/startup/redisStartup');

const app = express();

const serverStart =async () => {
    await require('./app/startup/mongodbStartup')(mongoose);
    await redisConnection();
    await require('./app/startup/expressStartup')(app);
}

serverStart()
    .then(() => {
    app.listen(PORT, () => {
        console.log(`Server Running on http://localhost:${PORT}`);
    })
}).catch((err) => {
    console.log(err.message);
})
