const userControllers = require("../../controller/userController");

module.exports = [
    {
        method: "GET",
        path: "/hello",
        handler: userControllers.hello,
    },
]
