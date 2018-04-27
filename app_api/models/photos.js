const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    comment: {
        type: String,
        required: true
    },
    createdOn: {
        type: Date,
        default: Date.now
    },
});

const photoSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    content: {
        type: String
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments: [commentSchema],
    createdOn: {
        type: Date,
        default: Date.now
    },
    name: {
        type: String
    },
    size: {
        type: Number,
        default: 0
    },
    contentType: String,
    data: Buffer,
});


mongoose.model('Photo', photoSchema);
