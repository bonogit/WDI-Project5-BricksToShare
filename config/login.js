// var passport = require('passport');
var LocalStrategy   = require('passport-local').Strategy;
var models = require('../models/index');
var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport){
    passport.use('login', new LocalStrategy({
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true
      },
      function(req,username,password,cb){
        console.log('input user and password are: '+username+password);
        models.user.findOne({where: {email: username}}).then(function(user, err){
          if(err){
            // console.log('general err: '+err);
            return cb(err);
          }
          if(!user){
            console.log('user doesnot exist');
            return cb(null, false, req.flash('message','Incorrect username'));
          }
          // if(user.password != password){
          if(!isValidPassword(user,password)){
            console.log('user password not correct');
            return cb(null, false, req.flash('message','Invalid Password'));
          }
          console.log('username and password checked!');
          return cb(null, user);
        }).catch(function(err){
          console.log('new error: '+ err);
        });
      }
     ));
   
      var isValidPassword = function(user, password){
        return bCrypt.compareSync(password, user.password);
    }

}

