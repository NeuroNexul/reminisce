const chalk = require("chalk");

module.exports = function (io) {
      

      io.on("connection", (socket) => {
            console.log(chalk.greenBright(">>===> A user connected", socket.id));

            socket.on("message", (data) => {
                  console.log(chalk.greenBright(">>===> Message Received: ", data));
                  socket.broadcast.emit("message", data);
            });

            socket.on('autoSave', require('./autoSave')(socket));

            socket.on("disconnect", () => {
                  console.log(chalk.redBright(">>===> A user disconnected"));
            });
      });
}