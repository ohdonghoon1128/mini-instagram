const mongoose = require('mongoose');
const User = mongoose.model('User');
const Photo = mongoose.model('Photo');
const passport = require('passport');

const USERID_LEN = 20;
const NAME_LEN = 20;
const DESCRIPTION_LEN = 100;

/*
    creat a user account
*/
const register = function(req, res) {
    if(!req.body.userid || !req.body.email || !req.body.password) {
        return res.status(404).json({message: 'userid, email and password required'});
    }
    
    let userid = req.body.userid;
    if(typeof userid !== 'string') {
        return res.status(404).json({message: 'userid must be string type'});
    }
    if(userid.search(/^[A-Za-z][A-Za-z0-9_]*$/) < 0) {
        return res.status(404).json({message: 'userid format error'});
    }
    if(userid.length > 20) {
        return res.status(404).json({message: 'userid max length must be 20'});
    }
    userid = userid.toLowerCase();


    const user = new User();
    user.userid = userid;
    user.email = req.body.email;
    user.setPassword(req.body.password);

    user.save((err) => {
        if(err) {
            return res.status(404).json({
                name: err.name,
                message: err.message
            });
        }

        res.status(201).json({token: user.generateJwt()});
    });
};

/*
    login
*/
const login = function(req, res) {
    if(typeof req.body.userid !== 'string') {
        return res.status(404).json({message: 'userid must be string type'});
    }
    req.body.userid = req.body.userid.toLowerCase();

    passport.authenticate('local', (err, user, info) => {
        if(err) {
            res.status(404).json({
                name: err.name,
                message: err.message
            });
        } else if(!user) {
            res.status(404).json(info);
        } else {
            res.status(200).json({token: user.generateJwt()});
        }
    })(req, res);
};


/*
    read a user profile
*/
const readProfile = function(req, res) {
    User
        .findOne({userid: req.payload.userid})
        .exec((err, user) => {
            if(err) {
                return res.status(404).json({
                    name: err.name,
                    message: err.message
                });
            } else if(!user) {
                return res.status(404).json({message: `${req.payload.userid} not found`});
            }
            res.status(200).json({
                userid: user.userid,
                email: user.email,
            });
        });
};

/*
    update a user profile
*/
const updateProfile = function(req, res) {
    let name = req.body.name;
    let description = req.body.description;
    let email = req.body.email;

    name = typeof name !== 'string' ? '' : name.substring(0, NAME_LEN);
    description = typeof description !== 'string' ? ''
                  : description.trim().replace(/\s+/g, ' ').substring(0, DESCRIPTION_LEN);
    email = typeof email !== 'string' ? '' : email; //Add email validation later

    if(!name && !description && !email) {
        return res.status(200).json({
            message: 'Not changed'
        })
    }

    User
        .findOne({userid: req.payload.userid})
        .exec((err, user) => {
            if(err) {
                return res.status(404).json({
                    name: err.name,
                    message: err.message
                });
            } else if(!user) {
                return res.status(404).json({message: `${req.payload.userid} not found`});
            }

            user.name = name || user.name;
            user.email = email || user.email;
            user.description = description || user.description;
            user.save((err) => {
                if(err) {
                    return res.status(404).json({
                        name: err.name,
                        message: err.message
                    });
                }
                res.status(200).json({token: user.generateJwt()});
            });
        });
};

/*
    update a user password
*/
const updatePassword = function(req, res) {
    User
        .findOne({userid: req.payload.userid})
        .exec((err, user) => {
            if(err) {
                return res.status(404).json({
                    name: err.name,
                    message: err.message
                });
            } else if(!user) {
                return res.status(404).json({message: `${req.payload.userid} not found`});
            } else if(!user.validPassword(req.body.password)) {
                return res.status(401).json({message: `incorrect old password`});
            }


            if(!req.body.newPassword) {
                return res.status(404).json({message: 'new password required'});
            }
            user.setPassword(req.body.newPassword);
            user.save((err) => {
                if(err) {
                    return res.status(404).json({
                        name: err.name,
                        message: err.message
                    });
                }

                res.status(200).json({token: user.generateJwt()});
            });
        });
};

/*
    delete a user account
*/
const deleteAccount = function(req, res) {
    User
        .findOne({userid: req.payload.userid})
        .exec((err, user) => {
            if(err) {
                return res.status(404).json({
                    name: err.name,
                    message: err.message
                });
            } else if(!user) {
                return res.status(404).json({message: `${req.payload.userid} not found`});
            } else if(!user.validPassword(req.body.password)) {
                return res.status(401).json({message: `incorrect password`});
            }

            user
                .remove()
                .then((val) => {
                    Photo.remove({owner: user._id}, (err) => {
                        if(err) {
                            console.log(`photo delete ERROR: ownerid ${user._id}`);
                        }
                        res.status(204).json(null);
                    });
                })
                .catch((err) => {
                    res.status(404).json({
                        name: err.name,
                        message: err.message
                    });
                });
        });
};

const readAccessLevel = function(req, res) {
    const userid = req.params.userid;

    if(!userid) {
        return res.status(404).json({message: 'userid param required'});
    }

    User
        .findOne({userid: userid})
        .select('userid isPrivate')
        .exec((err, user) => {
            if(err) {
                return res.status(404).json({
                    name: err.name,
                    message: err.message
                });
            } else if(!user) {
                return res.status(404).json({
                    message: `${userid} not found`
                });
            }

            res.status(200).json({
                userid: user.userid,
                isPrivate: user.isPrivate
            });
        });
};

const updateAccessLevel = function(req, res) {
    let isPrivate = req.body.isPrivate;
    if(isPrivate === 'private') {
        isPrivate = true;
    } else if(isPrivate === 'public') {
        isPrivate = false;
    } else {
        return res.status(404).json({
            message: 'isPrivate must be either string "public" or "private"'
        });
    }

    User.findOneAndUpdate({userid: req.payload.userid}, {$set: {isPrivate: isPrivate}}, (err, user) => {
        if(err) {
            return res.status(404).json({
                name: err.name,
                message: err.message
            });
        }

        res.status(200).json({
            isPrivate: isPrivate
        });
    });
};

const readPublicInfo = function(req, res) {
    const userid = req.params.userid;

    User
        .findOne({userid: userid})
        .select('name description userid')
        .exec((err, user) => {
            if(err) {
                return res.status(404).json({
                    name: err.name,
                    message: err.message
                });
            } else if(!user) {
                return res.status(404).json({
                    message: `${userid} not found`
                });
            }

            res.status(200).json({
                name: user.name,
                description: user.description,
                userid: user.userid
            });
        });
};

module.exports = {
    register: register,
    login: login,
    readProfile: readProfile,
    updateProfile: updateProfile,
    updatePassword: updatePassword,
    deleteAccount: deleteAccount,
    readPublicInfo: readPublicInfo,
    readAccessLevel: readAccessLevel,
    updateAccessLevel: updateAccessLevel
};
