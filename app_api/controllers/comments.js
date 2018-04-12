const mongoose = require('mongoose');
//const Comment = mongoose.model('Comment');

const readAll = function(req, res) {
    res.status(200).json({message: ' comment'});
};

const createOne = function(req, res) {
    res.status(200).json({message: 'POST: create comment'});
};

const readOne = function(req, res) {
    res.status(200).json({message: 'GET: read comment'});
};

const updateOne = function(req, res) {
    res.status(200).json({message: 'PUT: update comment'});
};

const deleteOne = function(req, res) {
    res.status(200).json({message: 'DELETE: delete comment'});
};


module.exports = {
    createOne: createOne,
    readOne: readOne,
    updateOne: updateOne,
    deleteOne: deleteOne
};
