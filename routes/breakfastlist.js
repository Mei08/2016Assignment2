var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Breakfast = require('../models/breakfastlist');

// set up the GET handler for breakfast page
router.get('/', function(req, res, next) {
    Breakfast.find(function(err, breakfastlist) {
        //  error message
        if (err) {
            console.log(err);
            res.end(err);
        }
        else {
            // show the view and pass the data to it
            res.render('breakfastlist/index', {
                title: 'breakfastList',
                breakfast : breakfastlist
            });
        }
    });
});

// make public
module.exports = router;