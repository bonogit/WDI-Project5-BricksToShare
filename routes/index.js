var express = require('express');
var app = express();

var router = express.Router();
var models = require('../models/index');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
// require('../config/passport')(passport);


//for include syntax
var userModel = models.user;

/* GET home page. */

router.get('/', function(req, res, next) {

  models.brickset.findAll({
    attributes:['set_id','descr','img_sm'
    // ,[models.fn('COUNT',models.col('counter')),'count']
    ],
    // order: ['count', 'DESC'],
    limit: 10,
    group: ['set_id','descr','img_sm'],
    // where: { $or: [{own: true},{want: true}]},
    where: {want: true},
  }).then(function(topSets){
    models.brickset.findAll({
      order: 'theme',
      limit: 10,
    where: { $or: [{own: true},{want: true}]},
    include: [{
          model: userModel
        }]
    }).then(function(topSetsTheme){
      res.render('index',{
        topSets: topSets,
        topSetsTheme: topSetsTheme
      });
    });
  });  
});

//page for sets view
router.get('/setsview',function(req,res){
  models.brickset.count({
    where:{$and: [{own: false},{want: false}]}
  }).then(function(countSum){
     models.brickset.findAll({
       attributes: ['id','theme']
  }).then(function(themeTag){
     models.brickset.findAndCountAll({
      attributes: ['id','set_id','theme','year','descr','img_sm'],
      where:{$and: [{own: false},{want: false}]},
      limit: 10,
      offset: 0
     }).then(function(legoSets){
        res.render('setsview',{
            legoSets: legoSets.rows,
            resultNo: countSum,
            themeTag: themeTag
          });  
     });   
    });
  });
});

router.get('/setsview/:id',function(req,res){
   models.brickset.count({
    where:{$and: [{own: false},{want: false}]}
  }).then(function(countSum){
     models.brickset.findAll({
       attributes: ['id','theme']
  }).then(function(themeTag){
     var offsetNo = (parseInt(req.params.id)-1)*10;
     models.brickset.findAll({
      attributes: ['id','set_id','theme','year','descr','img_sm'],
      where:{$and: [{own: false},{want: false}]},
      limit: 10,
      offset: offsetNo
     }).then(function(legoSets){
        res.render('setsview',{
            legoSets: legoSets,
            resultNo: countSum,
            themeTag: themeTag
          });  
     });   
    });
  });
});


//for sets view search
router.get('/search',function(req,res){
  models.brickset.findAll({
    where: {
      theme: req.query.key,
      $and: [{own: false},{want: false}]
    }
  }).then(function(searchByTheme){
    res.render('search',{
      dataByTheme: searchByTheme,
      resultNo: searchByTheme.length,
      themeName: req.query.key
    });
  });
});


//show single set
router.get('/singleset/:id',function(req,res){
  
  models.brickset.find({
    where: {
      id: req.params.id
    }
  }).then(function(singleset){
      models.brickset.count({
        where: {set_id: singleset.set_id,
                own: true
        },
        include:[{
          model: userModel
        }]
    }).then(function(ownCount){
      models.brickset.count({
        where: {set_id: singleset.set_id,
                want: true
        },
        include:[{
          model: userModel
        }]
    }).then(function(wantCount){
      models.brickset.count({
        where: {set_id: singleset.set_id,
                own: true
        },
        include:[{
          model: userModel,
          id: 1
        }]
    }).then(function(checkOwnSum){
      // console.log('records of want is:'+ownData.count);
      res.render('singleset',{
      singleset: singleset,
      ownCount: ownCount,
      wantCount: wantCount,
      checkOwnSum: checkOwnSum
      });
    });
   });
  });
 });
});

//set own router
router.post('/singleset/own',function(req,res){
   models.brickset.create({
    set_id: req.body.set_id,
    descr: req.body.descr,
    theme: req.body.theme,
    year: req.body.year,
    img_sm: req.body.img_sm,
    img_tn: req.body.img_tn,
    img_big: req.body.img_big,
    own: true
  }).then(function(setNew){
    models.ownership.create({
      userId: parseInt(req.body.userlogId),
      bricksetId: setNew.id,
  }).then(function(ownershipNew){
    res.json({ownershipNew,setNew});
  });
 }); 
});
//set want router
router.post('/singleset/want',function(req,res){
    models.brickset.create({
        set_id: req.body.set_id,
        descr: req.body.descr,
        theme: req.body.theme,
        year: req.body.year,
        img_sm: req.body.img_sm,
        img_tn: req.body.img_tn,
        img_big: req.body.img_big,
        want: true
      }).then(function(setNew){
        models.ownership.create({
          userId: parseInt(req.body.userlogId),
          bricksetId: setNew.id,
      }).then(function(ownershipNew){
        res.json({ownershipNew,setNew});
      });
     }); 
    });


//my sets view
router.get('/mysets',function(req,res){

  models.brickset.findAndCountAll({
    where:{
      own: true
    },
    include:[{
          model: userModel,
          id: 1
        }]
  }).then(function(ownData){
      models.brickset.findAndCountAll({
      where: {
        want: true
      },
        include:[{
          model: userModel,
          id: 1
        }]
  }).then(function(wantData){
        res.render('mysets',{
          ownData: ownData.rows,
          wantData: wantData.rows,
          recordCount: ownData.count+wantData.count
        });
  });
 });
});

//delete my owning item and render mysets again
router.delete('/mysets/deleteOwnOrWant',function(req,res){
  models.brickset.destroy({
     where: {
        id: req.body.setDeleteId
     }
   }).then(function(setDelete){
      res.json(setDelete);
  });
});


//page for update data from api
router.get('/dataCollector', function(req,res){
  res.render('dataCollector');
});
// get data from api for table brickset
router.post('/brickset', function(req, res) {

  models.brickset.create({
      set_id: req.body.set_id,
      descr: req.body.descr,
      theme: req.body.theme,
      year: req.body.year,
      img_tn: req.body.img_tn,
      img_sm: req.body.img_sm,
      img_big: req.body.img_big
  }).then(function(brickset) {
    res.json(brickset);
  });
});

//authentication(for testing)
// router.post('/login',
//   passport. authenticate('local',{
//     successRedirect:'/',
//     failureRedirect: '/login',
//     failureFlash: true
//   })
//   );

//a testing page for associate models
// router.get('/login',function(req,res){
//   var temp = models.user;
//   models.brickset.findAll({
//     where: {id: 2},
//     include: [{
//       model: temp,
//       where: { id: 1 }
//     }]
      
//   }).then(function(data){    
//       res.json(data);
//     // res.render('login',{
//     //   data: data
//     // });
//   });
// });

// //create user
// router.post('/users', function(req, res) {
//   models.user.create({
//     email: req.body.email
//   }).then(function(user) {
//     res.json(user);
//   });
// });

// router.get('/profile', isLoggedIn, function(req, res) {
//         res.render('profile.ejs', {
//             user : req.user // get the user out of session and pass to template
//         });
//     });

// router.get('/logout', function(req, res) {
//         req.logout();
//         res.redirect('/');
//     });


// // route middleware to make sure a user is logged in
// function isLoggedIn(req, res, next) {

//     // if user is authenticated in the session, carry on 
//     if (req.isAuthenticated())
//         return next();

//     // if they aren't redirect them to the home page
//     res.redirect('/');
// }

// router.post('/signup',passport.authenticate('local-signup',{
//   successRedirect : '/profile',
//   failureRedirect : '/signup',
//   failureFlash : true //allow flash messages
// }));

// process the login form
// router.post('/login', passport.authenticate('local-login', {
//     successRedirect : '/profile', // redirect to the secure profile section
//     failureRedirect : '/login', // redirect back to the signup page if there is an error
//     failureFlash : true // allow flash messages
// }));

//authentication (for real)
// router.get('/signup',function(req,res){
//   res.render('signup'
//     // ,{message: req.flash('loginMessage')}
//     );
// });

// authentication set up
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password'
  },
  function(username,password,cb){
    console.log('input user and password are: '+username+password);
    models.user.findOne({where: {email: username}}).then(function(user, err){
      if(err){
        console.log('general err: '+err);
        return cb(err);
      }
      if(!user){
        console.log('user doesnot exist');
        return cb(null, false, {message: 'Incorrect username'});
      }
      if(user.password != password){
        console.log('user password not correct');
        return cb(null, false);
      }
      console.log('username and password checked!');
      return cb(null, user);
    });
  }
 ));

passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  models.user.findById(id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

router.get('/signup',function(req,res){
  res.render('signup');
});

router.post('/signup',
  passport.authenticate('local',{failureRedirect:'/dataCollector'
  }),
  function(req,res){
    res.redirect('/');
});


router.get('/users', function(req, res) {
  models.user.findAll({
  }).then(function(userData){
  res.json(userData);
  });
});



module.exports = router;

