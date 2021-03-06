const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    userid: {
        type: String,
        required: true,
        unique: true
    },
    name: String,
    description: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    followersReqQ: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    followersDenyList: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    followersAcceptList: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    isPrivate: {
        type: Boolean,
        default: false
    },
    hash: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    }
});

userSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha1').toString('hex');
};

userSchema.methods.validPassword = function(password) {
    return this.hash === crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha1').toString('hex');
};

userSchema.methods.generateJwt = function() {
    const exp = new Date();
    exp.setHours(exp.getHours() + 1);

    return jwt.sign({
        exp: exp.getTime(),
        _id: this._id,
        userid: this.userid,
        email: this.email
    }, process.env.JWT_SECRET);
};

//register user schema
mongoose.model('User', userSchema);
