const express = require('express');
const router = express.Router();

const expressJwt = require('express-jwt');
const auth = expressJwt({
    userProperty: 'payload',
    secret: process.env.JWT_SECRET,
    credentialsRequired: false,
});

const ctrlPhoto = require('../controllers/photos');
const ctrlComment = require('../controllers/comments');
const ctrlAuth = require('../controllers/authentications');

/*
    SUPER_USER: 0,
    OWNER: 1,
    FRIENDS: 2,
    OTHERS: any number other than 0, 1, 2
*/
const accessLevel = {
    SUPER_USER: 0,
    OWNER: 1,
    FRIENDS: 2
};
/*
function authLevel(accessRequiredLevel) {
    return (req, res, next) => {
        if(accessRequiredLevel === accessLevel.SUPER_USER) {
        } else if(accessRequiredLevel === accessLevel.OWNER) {
            User
                .findOne({userid: req.payload.userid})
                .exec((err, user) => {
                    if(err) {
                        res.status(404).json(err);
                    }
                });
            next();
        } else if(accessRequiredLevel === accessLevel.FRIENDS) {
            next();
        } else {
            if(req.payload) {
                req.payload.authorized = true;
            } else {
                req.payload = {
                    authorized = true;
                };
            }
            next();
        }
    };
}
*/

//validate user authentication token and add the information to req.payload
router.use(auth);
//if user does not have token, add empty payload object to request body
router.use((req, res, next) => {
    req.payload = req.payload || {};
    next();
});



/*
//user handlers
router.get('/users', ctrlUser.listUsers);
router.post('/users/:userid', ctrlUser.createOne);
router.get('/users/:userid', ctrlUser.readOne);
router.put('/users/:userid', ctrlUser.updateOne);
router.delete('/users/:userid', ctrlUser.deleteOne);
*/


//router.get('/users/:userid', ctrl);

//photo route handler
router.get('/photo', ctrlPhoto.listByOwner); //req.query.userid must be provided and controller must check it
router.post('/photo', ctrlPhoto.createOne);
router.get('/photo/:photoid', ctrlPhoto.readOne);
router.put('/photo/:photoid', ctrlPhoto.updateOne);
router.delete('/photo/:photoid', ctrlPhoto.deleteOne);
router.get('/randomPhotos', ctrlPhoto.listByTime);



//comments handler
router.post('/photos/:photoid/comments', ctrlComment.createOne);
router.get('/photos/:photoid/comments/:commentid', ctrlComment.readOne);
router.put('/photos/:photoid/comments/:commentid', ctrlComment.updateOne);
router.delete('/photos/:photoid/comments/:commentid', ctrlComment.deleteOne);



//this middleware check whether a user has logged in or not.
const isOwner = function(req, res, next) {

    console.log(req.payload);

    if(!req.payload.userid) {
        return res.status(401).json({message: 'Invalid token'});
    }
    next();
};
//Authentication handler
router.post('/account/register', ctrlAuth.register);
router.post('/account/login', ctrlAuth.login);

//Owner of the account can write, modify and read their information
router.get('/account/profile', isOwner, ctrlAuth.readProfile);
router.put('/account/profile', isOwner, ctrlAuth.updateProfile);
router.put('/account/password', isOwner, ctrlAuth.updatePassword);
router.put('/account/access_level', isOwner, ctrlAuth.updateAccessLevel);
//I want a user send confirmation password in body, so I decide to use POST method instead of DELETE method
router.post('/account/delete', isOwner, ctrlAuth.deleteAccount);

//read users public information, everyone can access this data
router.get('/account/user/:userid', ctrlAuth.readPublicInfo);
router.get('/account/user/:userid/access_level', ctrlAuth.readAccessLevel);

module.exports = router;
