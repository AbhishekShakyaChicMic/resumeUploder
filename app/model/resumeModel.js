const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    resumelink: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    fileName: {
        type: String,
        required: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

const resumeModel = mongoose.model("Resume", resumeSchema);

module.exports = resumeModel;