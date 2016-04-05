var express = require('express');
var router = express.Router();
// add auth package refs
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


// github auth config
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

// GET github login
router.get('/github', passport.authenticate('github', { scope: ['user.email'] }));
router.get('/github/callback', passport.authenticate('github', {
    failureRedirect: '/auth/login'}),
    function(req, res) {
        res.redirect('/lists');
    }
);

// GET login - show login form
router.get('/login', function(req, res, next) {
    // store the session messages in a local variable
    var messages = req.session.messages || [];

    // clear the session messages
    req.session.messages = [];

    // check if user is already logged in
    if (req.isAuthenticated()) {
        res.redirect('/auth/welcome');
    }
    else {
        // show the login page and pass in any messages we may have
        res.render('auth/login', {
            title: 'Login',
            user: req.user,
            messages: messages
        });
    }

});

// POST login - validate user

 router.post('/login', passport.authenticate('local', {
    successRedirect: '/auth/welcome',
    failureRedirect: '/auth/login',
    failureMessage: 'Invalid Login'
    //failureFlash: true
}));

// GET register - show registration form
router.get('/register', function(req, res, next) {
   res.render('auth/register', {
    title: 'Register'
   });
});

// GET welcome - show welome page for authenticated users
router.get('/welcome', isLoggedIn, function(req, res, next) {
   res.render('auth/welcome', {
       title: 'Welcome',
       user: req.user
   });
});

// POST register - save new user
router.post('/register', function(req, res, next) {
    /* Try to create a new account using our Account model & the form values
    If we get an error display the register form again
    If registration works, store the user and show the articles main page */
    Account.register(new Account({ username: req.body.username }), req.body.password, function(err, account) {
        if (err) {
           return res.render('auth/register', { title: 'Register' });
        }
        else {
            /*req.login(account, function(err) {
                res.redirect('/articles');
            });*/
            res.redirect('/auth/login');
        }
    });
});

// GET logout
router.get('/logout', function(req, res, next) {
    // we can use either of these
    //req.session.destroy();
    req.logout();
    res.redirect('/');
});

// auth check
function isLoggedIn(req, res, next) {

    // is the user authenticated?
    if (req.isAuthenticated()) {
        return next();
    }
    else {
        res.redirect('/auth/login');
    }
}
// GET register
router.get('/register', function(req, res, next) {
   res.render('auth/register', {
    title: 'Register'
   });
});
// POST register - save new user
router.post('/register', function(req, res, next) {
    /* Try to create a new account using our Account model & the form values
    If we get an error display the register form again
    If registration works, store the user and show the articles main page */
    Account.register(new Account({ username: req.body.username }), req.body.password, function(err, account) {
        if (err) {
           return res.render('auth/register', { title: 'Register' });
        }
        else {
            /*req.login(account, function(err) {
                res.redirect('/articles');
            });*/
            res.redirect('/auth/login');
        }
    });
});
// GET login 
router.get('/login', function(req, res, next) {
    res.render('auth/login', {
        title: 'Login'
    });
});

module.exports = router;