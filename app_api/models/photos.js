const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    content: {
        type: String
    },
    likes: {
        type: Number,
        default: 0
    },
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
