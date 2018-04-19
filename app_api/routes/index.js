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

/*
    Parse user authentication token and add the information to req.payload
*/
router.use(auth);



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


/*
//authentication handler
router.post('/auth/register', ctrlAuth.register);
router.post('/auth/login', ctrlAuth.login);
router.put('/auth/:userid', ctrlAuth.updateOne);
router.delete('/auth/:userid', ctrlAuth.deleteOne);
*/



//authentication middleware check, if user has logged in.
const isOwner = function(req, res, next) {
    if(!req.payload) {
        return res.status(401).json({message: 'Invalid token'});
    }
    next();
};
/*
    authentication handler
*/
router.post('/account/register', ctrlAuth.register);
router.post('/account/login', ctrlAuth.login);
//Owner of the account can write, modify and read their information
router.get('/account/profile', isOwner, ctrlAuth.readProfile);
router.put('/account/profile', isOwner, ctrlAuth.updateProfile);
router.put('/account/password', isOwner, ctrlAuth.updatePassword);
router.delete('/account/delete', isOwner, ctrlAuth.deleteAccount);


module.exports = router;
