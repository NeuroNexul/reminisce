const chalk = require("chalk");
const authModel = require("../models/auth");
const path = require("path");
const jwt = require("jsonwebtoken");
var cookieModule = require("cookie")


const autoSave = (socket) => (data) => {
      const { docId, commitId, content, cookie } = data;

      var cookies = cookieModule.parse(cookie);

      const jwtAuthToken = cookies.jwtAuthToken;

      if (jwtAuthToken) {
            const sub = jwt.verify(jwtAuthToken, process.env.PRIVATE_KEY).sub;

            authModel.findOneAndUpdate({ sub: sub, 'documents.id': docId }, {
                  $set: {
                        'documents.$.commits.$[j].content': content
                  }
            }, {
                  arrayFilters: [{ "j.id": commitId }],
                  new: true
            }).then(e => {
                  console.log(chalk.greenBright(`>>===> Auto Save Success: Document: ${docId}, Commit: ${commitId}`));
                  // broadcast to all sockets
                  socket.broadcast.emit("autoSave", { docId, commitId, content });
                  // socket.emit("autoSave", { docId, commitId, content });
            }).catch(e => {
                  console.error(chalk.redBright(`>>===> Auto Save Error: Document: ${docId}, Commit: ${commitId}`, e));
            });

      } else {
            return;
      }

}

module.exports = autoSave;
