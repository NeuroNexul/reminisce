const mongoose = require("mongoose");
const chalk = require("chalk");

class database {

      connect(uri, callback) {
            mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
                  .then(() => {
                        console.log(chalk.greenBright(">>===> Connected to the Database successfully"));
                        callback(null);
                  })
                  .catch((err) => {
                        console.log(chalk.redBright(">>===> An error occured while connecting to the Database"), err);
                        callback(err);
                  });
      }
}

module.exports = new database();
