const mongoose = require('mongoose');
const User = mongoose.model('User');


const register = function(req, res) {
    res.status(200).json({message: 'post: authentication REGISTER'});
};

const login = function(req, res) {
    res.status(200).json({message: 'post: authentication LOGIN'});
};


module.exports = {
    register: register,
    login: login
};
