var express = require('express');
var router = express.Router();

// GET register
router.get('/register', function(req, res, next) {
   res.render('auth/register', {
    title: 'Register'
   });
});

// GET login 
router.get('/login', function(req, res, next) {
    res.render('auth/login', {
        title: 'Login'
    });
});

module.exports = router;