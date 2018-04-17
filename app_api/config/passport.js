const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const mongoose = require('mongoose');
const User = mongoose.model('User');

passport.use(new LocalStrategy({
    usernameField: 'userid'
}, (userid, password, done) => {
    User
        .findOne({userid: userid})
        .exec((err, user) => {
            if(err) {
                done(err);
            } else if(!user) {
                done(null, false, {message: 'incorrect userid'});
            } else if(!user.validPassword(password)) {
                done(null, false, {message: 'incorrect password'});
            } else {
                done(null, user);
            }
        });
}));
