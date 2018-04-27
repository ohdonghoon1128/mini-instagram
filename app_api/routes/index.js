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


//this middleware check whether a user has logged in or not.
function isLoggedIn(req, res, next) {
    console.log(req.payload);
    if(!req.payload.userid) {
        return res.status(401).json({message: 'Invalid token'});
    }
    next();
};

//validate user authentication token and add the information to req.payload
router.use(auth);

//if user does not have token, add empty payload object to request body
router.use((req, res, next) => {
    console.log('My log in info: ' + req.payload);
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



//photo route handler
router.get('/photo', ctrlPhoto.listByOwner); //req.query.userid must be provided and controller must check it
router.post('/photo', ctrlPhoto.createOne);
router.get('/photo/:photoid', ctrlPhoto.readOne);
router.put('/photo/:photoid', ctrlPhoto.updateOne);
router.delete('/photo/:photoid', ctrlPhoto.deleteOne);
router.get('/randomPhotos', ctrlPhoto.listByTime);



//comments handler
router.get('/photo/:photoid/comment', ctrlComment.readAll);
router.post('/photo/:photoid/comment', isLoggedIn, ctrlComment.createOne);
router.get('/photo/:photoid/comment/:commentid', ctrlComment.readOne);
router.put('/photo/:photoid/comment/:commentid', isLoggedIn, ctrlComment.updateOne);
router.delete('/photo/:photoid/comment/:commentid', isLoggedIn, ctrlComment.deleteOne);



//Authentication handler
router.post('/account/register', ctrlAuth.register);
router.post('/account/login', ctrlAuth.login);

//Owner of the account can write, modify and read their information
router.get('/account/profile', isLoggedIn, ctrlAuth.readProfile);
router.put('/account/profile', isLoggedIn, ctrlAuth.updateProfile);
router.put('/account/password', isLoggedIn, ctrlAuth.updatePassword);
router.put('/account/access_level', isLoggedIn, ctrlAuth.updateAccessLevel);
//I want a user send confirmation password in body, so I decide to use POST method instead of DELETE method
router.post('/account/delete', isLoggedIn, ctrlAuth.deleteAccount);

//read users public information, everyone can access this data
router.get('/account/user/:userid', ctrlAuth.readPublicInfo);
router.get('/account/user/:userid/access_level', ctrlAuth.readAccessLevel);



module.exports = router;
