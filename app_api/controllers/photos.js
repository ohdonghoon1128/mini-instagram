const mongoose = require('mongoose');
const Photo = mongoose.model('Photo');
const User = mongoose.model('User');
const formidable = require('formidable');
const fs = require('fs');

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



const listByOwner = function(req, res) {
    const ownerid = req.query.ownerid;
    if(!ownerid) {
        return res.status(404).json({
            message: 'ownerid query required'
        });
    }
};


// create a photo: user must be logged in before perform this action
const createOne = function(req, res) {
    if(!req.payload.userid) {
        return res.status(404).json({
            message: 'you did not log in'
        });
    }

console.log(req.payload);

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
                            message: 'photo saved successfully'
                        });
                    });
                });
            });
        });
};

const readOne = function(req, res) {/*
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
    listByOwner: listByOwner,
    createOne: createOne,
    readOne: readOne,
    updateOne: updateOne,
    deleteOne: deleteOne
};
