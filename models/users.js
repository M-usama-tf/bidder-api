const mongoose = require("mongoose");

const Users = mongoose.Schema(
   {
      name: {
         type: String,
         require: [true, "No Name provided"],
      },

      email: {
         type: String,
         require: [true, "No Email provided"],
      },

      userId: {
         type: String,
         require: [true, "No Password provided"],
      },

      context: {
         type: Boolean,
         default: false,
      },

      limit: {
         type: Number,
         default: 10
      }
   },
   {
      timestamps: true,
   }
);

module.exports = mongoose.model("User", Users);