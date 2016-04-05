var express = require('express');
var router = express.Router();

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
//Get
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
//post
router.post('/add', function(req, res, next) {

 
    List.create( {
            title: req.body.title,
            content: req.body.content
        }
    );

  
    res.redirect('/lists');
});
router.get('/:id', function(req, res, next) {
   // create an id variable to store the id from the url
    var id = req.params.id;

    // look up the selected article
    List.findById(id,  function(err, list) {
       if (err) {
           console.log(err);
           res.end(err);
       }
        else {
           // show the edit view
           res.render('lists/edit', {
               title: 'Breakfast List',
               list: list
           });
       }
    });
});

router.post('/:id', function(req, res, next) {
    // create an id variable to store the id from the url
    var id = req.params.id;

    // fill the article object
    var list = new List( {
        _id: id,
        title: req.body.title,
        content: req.body.content
    });

    // use mongoose and our Article model to update
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
// GET handler for delete using the article id parameter
router.get('/delete/:id', function(req, res, next) {
   // grab the id parameter from the url
    var id = req.params.id;

    console.log('trying to delete');

    List.remove({ _id: id }, function(err) {
        if (err) {
            console.log(err);
            res.end(err);
        }
        else {
            // show updated articles list
            res.redirect('/lists');
        }
    });
});

// make public
module.exports = router;
