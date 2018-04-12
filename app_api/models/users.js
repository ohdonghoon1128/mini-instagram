const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
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

userSchema.methods.validPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha1').toString('hex');
};

userSchema.methods.validPassword = function(password) {
    return this.hash === crypto.pbkdf2Sync(password, this.slat, 1000, 64, 'sha1').toString('hex');
};

userSchema.methods.validPassword = function(password) {
    const exp = new Date();
    exp.setHours(exp.getHours() + 1);

    return jwt.sign({
        exp: exp,
        name: name,
        email: email
    }, process.env.JWT_SECRET);
};

//register user schema
mongoose.model('User', userSchema);
