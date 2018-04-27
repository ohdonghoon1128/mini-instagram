const mongoose = require('mongoose');
const Photo = mongoose.model('Photo');
const User = mongoose.model('User');

const readAll = function(req, res) {
/*
    const photoid = req.params.photoid;

    if(!photoid) {
        return res.status(404).json({message: 'photoid param required'});
    }

    Photo
        .findById(photoid)
        .populate('owner', 'follwersAcceptList')
        .exec((err, photo) => {
            if(err) {
                return res.status(404).json({
                    message: err.message,
                    name: err.name
                });
            } else if(!photo) {
                return res.status(404).json({message: `${photoid} not found`);
            }

            if(
        });
*/
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
