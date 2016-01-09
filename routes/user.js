var express = require('express');
var router = express.Router();
var passport = require('passport');
var Strategy = require('passport-local').Strategy;

/* GET users listing. */
router.get('/users', function(req, res) {
  models.user.findAll({
  }).then(function(userData){
  res.json(userData);
  });
});

module.exports = router;
