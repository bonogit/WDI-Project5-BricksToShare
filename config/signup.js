var LocalStrategy   = require('passport-local').Strategy;
var models = require('../models/index');
var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport){

  passport.use('signup', new LocalStrategy({
            usernameField: 'form-email',
            passwordField: 'form-password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {
               console.log('create user as: '+username+' and '+password);
            findOrCreateUser = function(){
                // find a user in Mongo with provided username
                models.user.findOne({where: {email: username}}).then(function(user,err) {
                    // In case of any error, return using the done method
                    if (err){
                        console.log('Error in SignUp: '+err);
                        return done(err);
                    }
                    // already exists
                    if (user) {
                        console.log('User already exists with username: '+username);
                        return done(null, false, req.flash('message','User Already Exists'));
                    } else {
                        // if there is no user with that email
                        // create the user

                        models.user.create({
                          email: username,
                          password: createHash(password)
                        }).then(function(user){
                            return done(null, user);
                        }).catch(function(err){
                            if (err) {
                                throw err;
                            };
                        });
                           
                        // var newUser = new User();

                        // // set the user's local credentials
                        // newUser.username = username;
                        // newUser.password = createHash(password);
                        // newUser.email = req.param('email');
                        // newUser.firstName = req.param('firstName');
                        // newUser.lastName = req.param('lastName');

                        // save the user
                        // newUser.save(function(err) {
                        //     if (err){
                        //         console.log('Error in Saving user: '+err);  
                        //         throw err;  
                        //     }
                        //     console.log('User Registration succesful');    
                        //     return done(null, newUser);
                        // });

                    }
                });
            };
            // Delay the execution of findOrCreateUser and execute the method
            // in the next tick of the event loop
            process.nextTick(findOrCreateUser);
        })
    );

    // Generates hash using bCrypt
    var createHash = function(password){
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    }

}