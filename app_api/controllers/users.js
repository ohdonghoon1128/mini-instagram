const mongoose = require('mongoose');
const User = mongoose.model('User');

/*
const listUsers = function(req, res) {
    res.status(200).json({message: 'GET: listusers'});
};
*/

/*
    create user and delete user should handle by authentication controller
*/
/*
const createOne = function(req, res) {
    res.status(200).json({message: 'POST: create user'});
};

const deleteOne = function(req, res) {
    res.status(200).json({message: 'DELETE: delete user'});
};
*/

const readOne = function(req, res) {
    res.status(200).json({message: 'GET: read user'});
};

const updateOne = function(req, res) {
    res.status(200).json({message: 'PUT: update user'});
};



module.exports = {
    //listUsers: listUsers,
    //createOne: createOne,
    readOne: readOne,
    updateOne: updateOne,
    //deleteOne: deleteOne
};
