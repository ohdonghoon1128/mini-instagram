const express = require('express');
const router = express.Router();

const expressJwt = require('express-jwt');
const auth = expressJwt({
    userProperty: 'payload',
    secret: process.env.JWT_SECRET,
    credentialsRequired: false,
});

//const ctrlUser = require('../controllers/users');
const ctrlComment = require('../controllers/comments');
const ctrlAuth = require('../controllers/authentications');

/*ADD authentication middleware later*******************************************************************/


/*
//user handlers
router.get('/users', ctrlUser.listUsers);
router.post('/users/:userid', ctrlUser.createOne);
router.get('/users/:userid', ctrlUser.readOne);
router.put('/users/:userid', ctrlUser.updateOne);
router.delete('/users/:userid', ctrlUser.deleteOne);
*/


//router.get('/users/:userid', ctrl);

//photos handler
/*
router.get('', ctrlPhoto.listPhotos);
router.post('/photos', ctrlPhoto.createOne);
router.get('/photos/:photoid', ctrlPhoto.readOne);
router.put('/photos/:photoid', ctrlPhoto.updateOne);
router.delete('/photos/:photoid', ctrlPhoto.deleteOne);
*/


//comments handler
router.post('/photos/:photoid/comments', ctrlComment.createOne);
router.get('/photos/:photoid/comments/:commentid', ctrlComment.readOne);
router.put('/photos/:photoid/comments/:commentid', ctrlComment.updateOne);
router.delete('/photos/:photoid/comments/:commentid', ctrlComment.deleteOne);


//authentication handler
router.post('/auth/register', ctrlAuth.register);
router.post('/auth/login', ctrlAuth.login);
router.put('/auth/:userid', ctrlAuth.updateOne);
router.delete('/auth/:userid', ctrlAuth.deleteOne);


module.exports = router;
