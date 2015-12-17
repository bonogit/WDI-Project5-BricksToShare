var express = require('express');
var router = express.Router();
var models = require('../models/index');

/* GET home page. */

router.get('/', function(req, res, next) {
  models.brickset.findAll({
  }).then(function(topSets){
    res.render('index',{
    topSets: topSets
    });    
  });


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

router.post('/users', function(req, res) {
  models.user.create({
    email: req.body.email
  }).then(function(user) {
    res.json(user);
  });
});

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

