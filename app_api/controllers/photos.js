const mongoose = require('mongoose');
const Photo = mongoose.model('Photo');
const User = mongoose.model('User');
const formidable = require('formidable');
const fs = require('fs');

const PHOTO_API_URL = 'https://localhost:3001/api/photo/';

const listByTime = function(req, res) {
    const PHOTO_PER_PAGE = 9;
    let page = parseInt(req.query.page, 10);
    page = page > 0 ? page : 0;

    Photo
        .find({})
        .select('-data')
        .sort('-_id')
        .populate({
            path: 'owner',
            match: {isPrivate: false},
            select: 'userid isPrivate'
        })
        .exec((err, photos) => {
            if(err) {
                return res.status(404).json({
                    name: err.name,
                    message: err.message
                });
            }
            photos = photos.filter((photo) => {
                return photo.owner && !photo.owner.isPrivate;
            });
            const isLastPage = PHOTO_PER_PAGE*(page + 1) >= photos.length;

            photos = photos
                        .slice((PHOTO_PER_PAGE*page), PHOTO_PER_PAGE*(page + 1))
                        .map((photo) => {
                            return {
                                name: photo.name,
                                ownerid: photo.owner.userid,
                                photoid: photo._id.toString(),
                                url: PHOTO_API_URL + photo._id.toString()
                            };
                        });

            res.status(200).json({photoInfos: photos, isLastPage: isLastPage});
        });
};

const listByOwner = function(req, res) {
    const ownerid = req.query.ownerid;
    if(!ownerid) {
        return res.status(404).json({
            message: 'ownerid query required'
        });
    }

    const PHOTO_PER_PAGE = 9;
    let page = parseInt(req.query.page, 10);
    page = page > 0 ? page : 0;

    User
        .findOne({userid: ownerid})
        .select('_id userid isPrivate followersAcceptList')
        .exec((err, user) => {
            if(err) {
                return res.status(404).json({
                    message: err.message,
                    name: err.name
                });
            } else if(!user) {
                return res.status(404).json({
                    message: `${ownerid} not found`
                });
            }

            if(user._id.toString() !== req.payload._id && user.isPrivate/* && !user.followersAcceptList.id(req.payload._id)*/) {
                return res.status(401).json({
                    message: 'Unauthorized User Error'
                });
            }

            Photo
                .find({owner: user._id})
                .select('_id name')
                .sort('-_id')
                .exec((err, photos) => {
                    if(err) {
                        return res.status(404).json({
                            message: err.message,
                            name: err.name
                        });
                    }

                    const isLastPage = PHOTO_PER_PAGE*(page + 1) >= photos.length;
                    const photoInfos = [];
                    photos
                        .slice((PHOTO_PER_PAGE*page), PHOTO_PER_PAGE*(page + 1))
                        .forEach((photo) => {
                            photoInfos.push({
                                ownerid: user.userid,
                                name: photo.name,
                                photoid: photo._id.toString(),
                                url: PHOTO_API_URL + photo._id.toString(),
                            });
                        });

                    res.status(200).json({photoInfos: photoInfos, isLastPage: isLastPage});
                });
        });
};


// create a photo: user must be logged in before perform this action
const createOne = function(req, res) {
    if(!req.payload.userid) {
        return res.status(404).json({
            message: 'you did not log in'
        });
    }

    //check if user account exist in the database, otherwise return error
    User
        .findById(req.payload._id)
        .exec((err, user) => {
            if(err) {
                return res.status(404).json({
                    name: err.name,
                    message: err.message
                });
            } else if(!user) {
                return res.status(404).json({
                    message: `${req.payload.userid} does not exist`
                });
            }

            //if user account exist, then save the photo to database
            const form = new formidable.IncomingForm();
            //**************************************************************************************
            //if have enough time, please implement reducing the file size
            //and allow photo size up to 500 kilo bytes
            form.maxFieldsSize = 1 * 1024 * 1024; // Allow 1 mega byte fields size
            form.maxFileSize = 14 * 1024 * 1024; // Allow 14 mega byte image size
            form.parse(req, (err, fields, files) => {
                if(err) {
                    return res.status(404).json({
                        name: err.name,
                        message: err.message
                    });
                } else if(!files.photo) {
                    return res.status(404).json({
                        message: 'please upload photo'
                    });
                }

                fs.readFile(files.photo.path, (err, data) => {
                    if(err) {
                        return res.status(500).json({
                            message: 'server error'
                        });
                    }
                    const photo = new Photo();
                    photo.data = data;
                    photo.contentType = files.photo.type;
                    photo.owner = user._id;
                    photo.save((err) => {
                        if(err) {
                            return res.status(404).json({
                                name: err.name,
                                message: err.message
                            });
                        }

                        res.status(201).json({
                            photoUrl: PHOTO_API_URL + photo._id
                        });
                    });
                });
            });
        });
};

const readOne = function(req, res) {
    const photoid = req.params.photoid;
    if(!photoid) {
        return res.status(404).json({
            message: 'photoid param required'
        });
    }

    Photo
        .findById(photoid)
        .populate('owner', '_id isPrivate followersAcceptList')
        .exec((err, photo) => {
            if(err) {
                return res.status(404).json({
                    message: err.message,
                    name: err.name
                });
            } else if(!photo) {
                return res.status(404).json({
                    message: `${photoid} does not exist`
                });
            }
            const owner = photo.owner;
            if(!owner) {
                return res.status(404).json({
                    message: 'owner of the photo not found'
                })
            }
            if(owner._id.toString() !== req.payload._id && owner.isPrivate /*&& !owner.followersAcceptList.id(req.payload._id)*/) {
                return res.status(404).json({
                    message: 'Unauthorized User Error'
                });
            }

            res.status(200).contentType(photo.contentType).send(photo.data);
        });
};

// this functionality is disabled
const updateOne = function(req, res) {
    res.status(200).json({message: 'this function is disabled now'});
};


// delete photo: user must be logged in to perform this action
// and photo must be belong to the user
const deleteOne = function(req, res) {
    const photoid = req.params.photoid;
    if(!photoid) {
        res.status(404).json({message: 'photoid param required'});
    }

    Photo.findOneAndRemove({_id: photoid, owner: req.payload._id}, (err, photo) => {
        if(err) {
            return res.status(404).json({
                name: err.name,
                message: err.message
            });
        } else if(!photo) {
            return res.status(404).json({
                message: 'either photo does not exist or you are not authorized to delete photo'
            });
        }

        res.status(204).json(null);
    });
};


module.exports = {
    listByTime: listByTime,
    listByOwner: listByOwner,
    createOne: createOne,
    readOne: readOne,
    updateOne: updateOne,
    deleteOne: deleteOne
};
