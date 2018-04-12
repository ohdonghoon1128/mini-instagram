const express = require('express');
const router = express.Router();

const expressJwt = require('express-jwt');
const auth = expressJwt({
    userProperty: 'payload',
    secret: process.env.JWT_SECRET,
    credentialsRequired: false,
});

const ctrlUser = require('../controllers/users');
const ctrlComment = require('../controllers/comments');
const ctrlAuth = require('../controllers/authentications');

/*ADD authentication middleware later*******************************************************************/

//user handlers
router.get('/users', ctrlUser.listUsers);
router.post('/users/:userid', ctrlUser.createOne);
router.get('/users/:userid', ctrlUser.readOne);
router.put('/users/:userid', ctrlUser.updateOne);
router.delete('/users/:userid', ctrlUser.deleteOne);

//comments handler
router.post('/users/:userid/comments', ctrlComment.createOne);
router.get('/users/:userid/comments/:commentid', ctrlComment.readOne);
router.put('/users/:userid/comments/:commentid', ctrlComment.updateOne);
router.delete('/users/:userid/comments/:commentid', ctrlComment.deleteOne);

//authentication handler
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);


module.exports = router;
