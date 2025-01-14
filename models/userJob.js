const mongoose = require("mongoose");

const userJobSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    jobTitle: {
        type: String,
        required: true
    },
    jobLink: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("UserJob", userJobSchema);
