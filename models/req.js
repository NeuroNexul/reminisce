const mongoose = require("mongoose");

const req = {
      array: {
            type: Array,
            required: true
      },
      binary: {
            type: Buffer,
            required: true
      },
      boolean: {
            type: Boolean,
            required: true
      },
      date: {
            type: Date,
            required: true
      },
      string: {
            type: String,
            required: true
      },
      number: {
            type: Number,
            required: true
      },
      object: {
            type: Object,
            required: true
      },
      regexp: {
            type: RegExp,
            required: true
      },
      objectid: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
      },
};

module.exports = req;