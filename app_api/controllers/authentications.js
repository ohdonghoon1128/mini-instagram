const mongoose = require('mongoose');
const User = mongoose.model('User');
const passport = require('passport');

/*
    creat a user account
*/
const register = function(req, res) {
    if(!req.body.userid || !req.body.email || !req.body.password) {
        return res.status(404).json({message: 'userid, email and password required'});
    }

    const user = new User();
    user.userid = req.body.userid;
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
const profile = function(req, res) {
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
const edit = function(req, res) {
    if(!req.body.password) {
        return res.status(404).json({message: 'password is required'});
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
            } else if(!user.validPassword(req.body.password)) {
                return res.status(401).json({message: `incorrect password`});
            }

            if(req.body.newPassword) {
                user.setPassword(req.body.newPassword);
            }
            if(req.body.email) {
                user.email = req.body.email;
            }
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
const deleteOne = function(req, res) {
    if(!req.body.password) {
        return res.status(404).json({message: 'password is required'});
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
            } else if(!user.validPassword(req.body.password)) {
                return res.status(401).json({message: `incorrect password`});
            }
            res.status(201).json(null);

            //******************************************************************************************************************************
            //have to clean all comments and photos that related to this user
        });
};

module.exports = {
    register: register,
    login: login,
    profile: profile,
    edit: edit,
    deleteOne: deleteOne
};
