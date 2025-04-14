const nodemailer = require('nodemailer');

const transporter1 = nodemailer.createTransport({
    service: 'gmail',
    secure: false,
    port: 587,
    auth: {
        user: "abhi75191112@gmail.com",
        pass: "icxhuyawyxguhzlk" // use app-specific password
    }
});


module.exports = transporter1;
