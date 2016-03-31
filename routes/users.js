var express = require('express');
var router = express.Router();

/* GET pages. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


module.exports = router;
