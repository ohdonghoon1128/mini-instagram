const mongoose = require('mongoose');
const Photo = mongoose.model('Photo');
const User = mongoose.model('User');

const readAll = function(req, res) {
    const photoid = req.params.photoid;

    if(!photoid) {
        return res.status(404).json({message: 'photoid param required'});
    }

    Photo
        .findById(photoid)
        .populate('owner', '_id isPrivate follwersAcceptList')
        .exec((err, photo) => {
            if(err) {
                return res.status(404).json({
                    message: err.message,
                    name: err.name
                });
            } else if(!photo) {
                return res.status(404).json({message: `${photoid} not found`});
            }

            const owner = photo.owner;
            if(owner._id.toString() !== req.payload._id && owner.isPrivate/* && !owner.followersAcceptList.id(req.payload._id)*/) {
                return res.status(404).json({message: `unauthorized user error`});
            }

            res.status(200).json(photo.comments);
        });
};

const createOne = function(req, res) {
    const photoid = req.params.photoid;
    let comment = req.body.comment;

    if(!photoid) {
        return res.status(404).json({message: 'photoid param required'});
    }
    if(typeof comment !== 'string') {
        return res.status(404).json({message: 'comment must be string type'});
    }

    comment = comment.trim().replace(/\s+/g, ' ');
    if(!comment) {
        return res.status(404).json({message: 'comment body contains empty string'});
    }

    Photo
        .findById(photoid)
        .populate('owner', '_id isPrivate follwersAcceptList')
        .exec((err, photo) => {
            if(err) {
                return res.status(404).json({
                    message: err.message,
                    name: err.name
                });
            } else if(!photo) {
                return res.status(404).json({message: `${photoid} not found`});
            }

            const owner = photo.owner;
            if(owner._id.toString() !== req.payload._id && owner.isPrivate/* && !owner.followersAcceptList.id(req.payload._id)*/) {
                return res.status(404).json({message: `unauthorized user error`});
            }

            photo.comments.push({
                author: req.payload.userid,
                comment: comment
            });

            photo.save((err) => {
                if(err) {
                    return res.status(404).json({
                        name: err.name,
                        message: err.message
                    });
                }

                res.status(200).json({
                    comment: photo.comments[photo.comments.length - 1]
                })
            });
        });
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
    readAll: readAll,
    createOne: createOne,
    readOne: readOne,
    updateOne: updateOne,
    deleteOne: deleteOne
};
