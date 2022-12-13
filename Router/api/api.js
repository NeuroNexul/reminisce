const Router = require('express').Router();

Router.use("/auth", require("./auth/auth.js"));
Router.use("/base", require("./basic/basic.js"));
Router.use("/docs", require("./docs/docs.js"));

module.exports = Router;