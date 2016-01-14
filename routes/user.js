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

// //create user
// router.post('/users', function(req, res) {
//   models.user.create({
//     email: req.body.email
//   }).then(function(user) {
//     res.json(user);
//   });
// });

// passport.use('log', new LocalStrategy({
//   usernameField: 'username',
//   passwordField: 'password',
//   pass
//   },
//   function(req,username,password,cb){
//     console.log('input user and password are: '+username+password);
//     models.user.findOne({where: {email: username}}).then(function(user, err){
//       if(err){
//         // console.log('general err: '+err);
//         return cb(err);
//       }
//       if(!user){
//         console.log('user doesnot exist');
//         return cb(null, false, req.flash('message','Incorrect username'));
//       }
//       if(user.password != password){
//         console.log('user password not correct');
//         return cb(null, false, req.flash('message','Invalid Password'));
//       }
//       console.log('username and password checked!');
//       return cb(null, user);
//     }).catch(function(err){
//       console.log('new error: '+ err);
//     });
//   }
//  ));

// passport.serializeUser(function(user, cb) {
//   console.log('serializeUser: '+user.id);
//   cb(null, user.id);
// });

// passport.deserializeUser(function(id, cb) {
//    console.log('deserializeUser: '+id);
//   // models.user.findById(id, function (err, user) {
//   //   if (err) { return cb(err); }
//   //   cb(null, user);
//   // });
//    models.user.findById(id).then(function(user,err){
//     if (err) { return cb(err)};
//     return cb(null, user);
//    });
// });

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
    passport.authenticate('login',{failureRedirect:'/dataCollector',
      successRedirect : '/mysets', // redirect to the secure profile section
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
    passport.authenticate('login',{failureRedirect:'/dataCollector',
      successRedirect : '/mysets', // redirect to the secure profile section
      failureFlash: true
    }));

  router.get('/signout',function(req,res){
    req.logout();
    res.redirect('/');
  });
  
  return router;
}

// module.exports = router;
