const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const mongoose = require('mongoose');
const User = mongoose.model('User');

passport.use(new LocalStrategy({
    usernameField: 'email'
}, (email, password, done) => {
    User
        .findOne({email: email})
        .exec((err, user) => {
            if(err) {
                done(err);
            } else if(!user) {
                done(null, false, {message: 'incorrect email'});
            } else if(!user.validPassword(password)) {
                done(null, false, {message: 'incorrect password'});
            } else {
                done(null, user);
            }
        });
}));
