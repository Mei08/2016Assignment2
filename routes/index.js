var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'allrecipes' });
});
/* GET list page. */
router.get('/breakfastlist', function(req, res, next) {
  res.render( 'breakfastlist', { title: 'breakfastList' });
});
module.exports = router;
