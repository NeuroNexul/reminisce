const mongoose = require("mongoose");
const getReq = require("./req");
const jwt = require('jsonwebtoken');
/**
 * 
 */
const authObject = {
      sub: getReq.string,
      idToken: getReq.string,

      name: getReq.string,
      email: getReq.string,
      avatar: getReq.string,
      
      bio: {
            type: String,
      },
      uploads: {
            type: Array,
      },
      documents: {
            type: Array,
      }
};

const authSchema = new mongoose.Schema(authObject);

const authModel = mongoose.model("auth", authSchema);

module.exports = authModel;
