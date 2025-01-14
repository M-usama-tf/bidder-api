const mongoose = require("mongoose");

const userJobSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    jobLinks: {
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
