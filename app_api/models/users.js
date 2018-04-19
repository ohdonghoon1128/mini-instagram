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
    email: {
        type: String,
        required: true,
        unique: true
    },
    followersReqQ: {
        type: [String]
    },
    followersDenyList: {
        type: [String]
    },
    followersAcceptList: {
        type: [String]
    },
    followsReqQ: {
        type: [String]
    },
    following: {
        type: [String]
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
        userid: this.userid,
        email: this.email
    }, process.env.JWT_SECRET);
};

//register user schema
mongoose.model('User', userSchema);
