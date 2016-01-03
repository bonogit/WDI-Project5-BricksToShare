

var express = require('express');
var router = express.Router();
var models = require('../models/index');
var passport = require('passport');
require('../config/passport')(passport);

/* GET home page. */

router.get('/', function(req, res, next) {

  models.brickset.findAll({
    order: 'id',
    limit: 10
  }).then(function(topSets){
    models.brickset.findAll({
      order: 'theme',
      limit: 10
    }).then(function(topSetsTheme){
      res.render('index',{
        topSets: topSets,
        topSetsTheme: topSetsTheme
      });
    });
  });  
  // models.brickset.findAll({
  //   order: 'theme',
  //   offset: 10,
  //   limit: 10
  // }).then(function(topSets){
  //   res.render('index',{
  //   topSets: topSets
  //   });    
  // });


});

//page for sets view
router.get('/setsview',function(req,res){
  models.brickset.findAll({
  }).then(function(legoSets){
    res.render('setsview',{
    legoSets: legoSets,
    resultNo: legoSets.length
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
    res.render('singleset',{
    singleset: singleset}
    );
  });

});

//my sets view
router.get('/mysets',function(req,res){
  res.render('mysets');
});

//create user
router.post('/users', function(req, res) {
  models.user.create({
    email: req.body.email
  }).then(function(user) {
    res.json(user);
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
router.get('/login',function(req,res){
  models.ownership.findAll({
    include: [models.user]
  }).then(function(ownership){
      console.log("check ownership.");
      console.log(ownership.set_id);

    res.render('login');
    });

});

router.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });

router.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });


// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

router.post('/signup',passport.authenticate('local-signup',{
  successRedirect : '/profile',
  failureRedirect : '/signup',
  failureFlash : true //allow flash messages
}));

// process the login form
router.post('/login', passport.authenticate('local-login', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/login', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
}));

//authentication (for real)
router.get('/signup',function(req,res){
  res.render('signup'
    // ,{message: req.flash('loginMessage')}
    );
});


//page for update data from api
router.get('/dataCollector', function(req,res){
  res.render('dataCollector');
});
// get data from api for table brickset
router.post('/brickset', function(req, res) {

  // forEach(request.body.legoSets, function(elem) {
  //   models.
  // })
    // var legoSets = req.body.legoSets;
    
    // legoSets.forEach(function(elem){
    //   models.brickset.create({
    //     set_id: elem.set_id,
    //     descr: elem.descr,
    //     theme: elem.theme,
    //     year: elem.year,
    //     img_tn: elem.img_tn,
    //     img_sm: elem.img_sm,
    //     img_big: elem.img_big
    //   }).then(function(brickset) {
    // res.json(brickset);
    // });

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


module.exports = router;

