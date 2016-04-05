var express = require('express');
var router = express.Router();
//mongoose
var mongoose = require('mongoose');
var List = require('../models/list');

router.get('/', function(req, res, next) {
  List.find(function(err, lists){
     if (err) {
         console.log(err);
         res.end(err);
     } 
     else {
         res.render('lists', {
            title: 'Lists',
            lists: lists 
         });
     }
  });
 
});
//Get an add 
router.get('/add', function(req, res, next) {
   if (req.isAuthenticated()) {
    res.render('lists/add', {
        title: 'Add a New One'
    });
    }
    else {
    res.redirect('/auth/login');
    }
});

router.post('/add', function(req, res, next) {
    List.create( {
            title: req.body.title,
            content: req.body.content,
            ingredient:req.body.ingredient,
            time:req.body.time
        }
    );
    res.redirect('/lists');
});
//create id for list
router.get('/:id', function(req, res, next) {
    if (req.isAuthenticated()) {
    var id = req.params.id;
    List.findById(id,  function(err, list) {
       if (err) {
           console.log(err);
           res.end(err);
                }
        else {
           res.render('lists/edit', {
               title: 'Breakfast List',
               list: list
           });
            }
    });
    }
     else {
    res.redirect('/auth/login');
    }
});

router.post('/:id', function(req, res, next) {
    var id = req.params.id;
    var list = new List( {
        _id: id,
        title: req.body.title,
        content: req.body.content,
         ingredient:req.body.ingredient,
            time:req.body.time
        
    });
    List.update( { _id: id }, list,  function(err) {
        if (err) {
            console.log(err)
            res.end(err);
        }
        else {
            res.redirect('/lists');
        }
    });
});
//create a delete function by id
router.get('/delete/:id', function(req, res, next) {
    if (req.isAuthenticated()) {
    var id = req.params.id
    console.log('delete');
    List.remove({ _id: id }, function(err) {
        if (err) {
            console.log(err);
            res.end(err);
        }
        else {
            res.redirect('/lists');
        }
    });
    } 
    else {
    res.redirect('/auth/login');
    }
});
// make it public
module.exports = router;
