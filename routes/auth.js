var express = require('express');
var router = express.Router();
// add auth package
var passport = require('passport');
var mongoose = require('mongoose');
var Account = require('../models/account');
var configDb = require('../config/db.js');
var gitHub = require('passport-github2');
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    Account.findById(id, function(err, user) {
        done(err, user);
    });
});
//create github auth config
passport.use(new gitHub({
    clientID: configDb.githubClientId,
    clientSecret: configDb.githubClientSecret,
    callbackURL: configDb.githubCallbackUrl
}, function(accessToken, refreshToken, profile, done) {
        var searchQuery = { name: profile.displayName };

        var updates = {
            name: profile.displayName,
            someID: profile.id
        };

        var options = { upsert: true };

        Account.findOneAndUpdate(searchQuery, updates, options, function(err, user) {
            if (err) {
                return done(err);
            }
            else {
                return done(null, user);
            }
        });
    }
));

//add a github login
router.get('/github', passport.authenticate('github', { scope: ['user.email'] }));
router.get('/github/callback', passport.authenticate('github', {
    failureRedirect: '/auth/login'}),
    function(req, res) {
        res.redirect('/lists');
    }
);
// GET login 
router.get('/login', function(req, res, next) {
    var messages = req.session.messages || [];
    req.session.messages = [];
    // check if user is logged in or not
    if (req.isAuthenticated()) {
        res.redirect('/auth/welcome');
    }
    else {
        res.render('auth/login', {
            title: 'Login',
            user: req.user,
            messages: messages
        });
    }

});

//validate user
router.post('/login', passport.authenticate('local', {
    successRedirect: '/auth/welcome',
    failureRedirect: '/auth/login',
    failureMessage: 'Invalid Login'
}));

// GET register 
router.get('/register', function(req, res, next) {
   res.render('auth/register', {
    title: 'Register'
   });
});
// POST register 
router.post('/register', function(req, res, next) {
    Account.register(new Account({ username: req.body.username }), req.body.password, function(err, account) {
        if (err) {
           return res.render('auth/register', { title: 'Register' });
        }
        else {
            res.redirect('/auth/login');
        }
    });
});
// GET welcome page
router.get('/welcome', isLoggedIn, function(req, res, next) {
   res.render('auth/welcome', {
       title: 'Welcome',
       user: req.user
   });
});

// create logout
router.get('/logout', function(req, res, next) {
    req.logout();
    res.redirect('/');
});
//redirect login
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    else {
        res.redirect('/auth/login');
    }
}



module.exports = router;