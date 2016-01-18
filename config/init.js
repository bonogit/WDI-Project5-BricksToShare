var login = require('./login');
var signup = require('./signup');
var models = require('../models/index');

module.exports = function(passport){

    passport.serializeUser(function(user, cb) {
      console.log('serializeUser: '+user.id);
      // console.log(user.dataValues);
      cb(null, user.id);
    });

    passport.deserializeUser(function(id, cb) {
       console.log('deserializeUser: '+id);
      // models.user.findById(id, function (err, user) {
      //   if (err) { return cb(err); }
      //   cb(null, user);
      // });
       models.user.findById(id).then(function(user,err){
       console.log(user.dataValues);
        if (err) { return cb(err)};
        return cb(null, user);
       });
    });
   login(passport);
   signup(passport);
};