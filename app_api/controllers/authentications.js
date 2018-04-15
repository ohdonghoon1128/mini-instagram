const mongoose = require('mongoose');
const User = mongoose.model('User');


/*
    creat a user account
*/
const register = function(req, res) {
    res.status(200).json({message: 'post: authentication REGISTER'});
};

/*
    read a user
*/
const login = function(req, res) {
    res.status(200).json({message: 'post: authentication LOGIN'});
};

const readOne = function(req, res) {

};

/*
    update a user account
*/
const updateOne = function(req, res) {
    /*
    if(!req.payload.authorized) {
        return res.status(401).json({message: ''});
    }
    */
};

/*
    delete a user account
*/
const deleteOne = function(req, res) {
    if(!req.payload.authorizedUser) {
        return res.status(401).json({message: 'Unauthorized User Error'});
    }

    User
        .findOne({email: req.payload.email})
        .exec((err, user) => {
            if(err) {
                return res.status(404).json(err);
            } else if(!user) {
                return res.status(404).json({message: `${req.payload.email} not found`});
            }

            
            /*
                have to clean all comments and photos that related to this user
            */
        });
};

module.exports = {
    register: register,
    login: login,
    readOne: readOne,
    updateOne: updateOne,
    deleteOne: deleteOne
};
