var express = require('express');
var router = express.Router();
var models = require('../models/index');
// var passport = require('passport');
// var LocalStrategy = require('passport-local').Strategy;

/* GET users listing. */
router.get('/list', function(req, res) {
  models.user.findAll({
  }).then(function(userData){
  res.json(userData);
  });
});


var isAuthenticated = function (req, res, next) {
  // if user is authenticated in the session, call the next() to call the next request handler 
  // Passport adds this method to request object. A middleware is allowed to add properties to
  // request and response objects
  if (req.isAuthenticated())
    return next();
  // if the user is not authenticated then redirect him to the login page
  res.redirect('/signup');
}

module.exports = function(passport){

  //render a page for both sign up and signup
  router.get('/signup',function(req,res){
    res.render('signup');
  });
  //render page for signin
  router.post('/signin',
    passport.authenticate('login',{failureRedirect:'/signup',
      successRedirect : '/setsview', // redirect to the secure section
      failureFlash: true
    }));

  router.post('/signup',passport.authenticate('signup',{
    successRedirect:'/',
    failureRedirect: '/signup',
    failureFlash: true
  }))

  // render single log in page
  router.get('/singlelogin',function(req,res){
    res.render('login');
  });
  
  router.post('/singlelogin',
    passport.authenticate('login',{failureRedirect:'/signup',
      successRedirect : '/setsview', // redirect to the secure section
      failureFlash: true
    }));

  // router.get('/signout',function(req,res){
  //   req.logout();
  //   res.redirect('/');
  // });
  
  router.get('/logout',function(req,res){
    req.logout();
    res.redirect('/');
  });

  return router;
}

// module.exports = router;
