const mongoose = require('mongoose');
const Photo = mongoose.model('Photo');
const User = mongoose.model('User');
const formidable = require('formidable');
const fs = require('fs');

const PHOTO_API_URL = 'https://localhost:3001/api/photo/';

const accessLevel = {
    OWNER: 0,
    FRIENDS: 1,
    OTHERS: 2
};

/*
const authorizedUser = function(req, res, photo) {
    Photo.findById(photoid)
        .select('ownerid')
        .exec((err, photo) => {
            if(photo.ownerid.equals(userid) && accessLevel.OWNER <= accessLevel) {
                return true
            }
            
        });
};

Photo
    .findById(photoid)
    .populate('ownerid', 'followersAcceptList')
    .exec((err, photo) => {
        if(err) {
        } else if(!photo) {
        }

        if(photo.ownerid._id
    });

*/

/*
const listByLikes = function(req, res) {
    Photo
        .find()
        .populate({
            path: 'owner',
            match: {isPrivate: false},
            select: '_id',
        })
        .limit(30)
        .sort('likes')
        .select('_id')
        .exec((err, photos) => {
        
        });
};
*/


const listByTime = function(req, res) {
    Photo
        .find({})
        .select('-data')
        .populate({
            path: 'owner',
            match: {isPrivate: false},
            select: 'userid isPrivate'
        })
        .exec((err, photos) => {
            if(err) {
                console.log('error herer?');
                return res.status(404).json({
                    name: err.name,
                    message: err.message
                });
            }

            photos = photos.filter((photo) => {
                return photo.owner && !photo.owner.isPrivate;
            }).map((photo) => {
                return {
                    name: photo.name,
                    ownerid: photo.owner.userid,
                    photoid: photo._id.toString(),
                    url: PHOTO_API_URL + photo._id.toString()
                };
            });

            res.status(200).json(photos.slice(0, 20));

            //Delete this later =============================
            console.log(photos.slice(0, 20));
            //Delete this later =============================
        });
};

const listByOwner = function(req, res) {
    const ownerid = req.query.ownerid;
    if(!ownerid) {
        return res.status(404).json({
            message: 'ownerid query required'
        });
    }

    User
        .findOne({userid: ownerid})
        .select('_id, userid')
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

            if(user._id !== req.payload._id && user.isPrivate/* && !user.followersAcceptList.id(req.payload._id)*/) {
                return res.status(401).json({
                    message: 'Unauthorized User Error'
                });
            }

            Photo
                .find({owner: user._id})
                .select('_id name')
                .exec((err, photos) => {
                    if(err) {
                        return res.status(404).json({
                            message: err.message,
                            name: err.name
                        });
                    }

                    const photoInfos = [];
                    photos.forEach((photo) => {
                        photoInfos.push({
                            ownerid: user.userid,
                            name: photo.name,
                            photoid: photo._id.toString(),
                            url: PHOTO_API_URL + photo._id.toString(),
                        });
                    });

                    res.status(200).json(photoInfos);
                    //Delete this later =============================
                    console.log(photoInfos);
                    //Delete this later =============================
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

console.log(req.body);
            //if user account exist, then save the photo to database
            const form = new formidable.IncomingForm();
            //**************************************************************************************
            //if have enough time, please implement reducing the file size
            //and allow photo size up to 500 kilo bytes
            form.maxFieldsSize = 1 * 1024 * 1024; // Allow 1 mega byte fields size
            form.maxFileSize = 14 * 1024 * 1024; // Allow 14 mega byte image size
            form.parse(req, (err, fields, files) => {

console.log(req.body);
console.log(fields);
console.log('==========================');
console.log(files);
console.log('==========================');


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

console.log(req.payload);
console.log('=========received fields:');
console.log(fields);
console.log('===========received files:');
console.log(files);
console.log('========================');

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
        .populate('owner', '_id followersAcceptList')
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
            if(owner._id !== req.payload._id && owner.isPrivate /*&& !owner.followersAcceptList.id(req.payload._id)*/) {
                return res.status(404).json({
                    message: 'Unauthorized User Error'
                });
            }

            res.status(200).contentType(photo.contentType).send(photo.data);
        });


/*
    User.findOne({userid: 'qwer'}).exec((err, user) => {
        Photo.findOne({owner: user._id}).exec((err, photo) => {
            if(err) {
                return res.status(404).json(err);
            }
            res.status(200).contentType(photo.img.contentType).send(photo.img.data);

    console.log(photo.img.contentType);

            console.log(photo);
        });
    });

User.findOne({userid: 'qwer'}).exec((err, user) => {
    res.status(200).json({token: user.generateJwt()});
});

    Photo.findById(req.params.photoid)
        .exec((err, photo) => {
            if(err) {
                return res.status(404).json({
                    name: err.name,
                    message: err.message
                });
            }

            res.status(200).contentType(photo.img.contentType).send(photo.data);
        });

Photo.findById(req.params.photoid)
    .exec((err, photo) => {
        if(err) {
            return res.status(404).json({
                name: err.name,
                message: err.message
            });
        }

if(!req.payload) {
    return res.status(404).json({message: 'no token'});
}

        User.findOne({userid: req.payload.userid})
            .exec((err, user) => {

                if(err) {
                    return res.status(404).json({
                        name: err.name,
                        message: err.message
                    });
                }
console.log(photo.owner);
console.log(user._id);


                if(!photo.owner.equals(user._id)) {
                    return res.status(404).json({message: 'unauthorized user'});
                } else {
                    res.status(200).contentType(photo.img.contentType).send(photo.img.data);
                }
            });
    });
*/
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
