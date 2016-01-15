var express = require('express');
var router = express.Router();
var models = require('../models/index');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
// require('../config/passport')(passport);


//for include syntax
var userModel = models.user;



  // if user is authenticated in the session, call the next() to call the next request handler 
  // Passport adds this method to request object. A middleware is allowed to add properties to
  // request and response objects
var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())
    return next();
  // if the user is not authenticated then redirect him to the login page
  res.redirect('/');
}

/* GET home page. */

router.get('/', function(req, res, next) {

  models.brickset.findAll({
    attributes:['set_id','descr','img_sm'
    ,[models.sequelize.fn('COUNT',models.sequelize.col('counter')),'count']
    ],
    order: 'count DESC',
    limit: 10,
    group: ['set_id','descr','img_sm',],
    // where: { $or: [{own: true},{want: true}]},
    where: {want: true},
  }).then(function(topWantSets){
    models.brickset.findAll({
      attributes:['set_id','descr','img_sm'
      ,[models.sequelize.fn('COUNT',models.sequelize.col('counter')),'count']      
      ],
      // order: ['count'],
      limit: 10,
      group: ['set_id','descr','img_sm'],
      order: 'count DESC',
      where: {own: true}
    }).then(function(topOwnSets){
      res.render('index',{
        topWantSets: topWantSets,
        topOwnSets: topOwnSets
      });
    });
  });  
});

//page for sets view
router.get('/setsview',isAuthenticated,function(req,res){
  console.log('current user check!', req.session.passport.user.id);
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
        console.log('current user iddfdfdfffffff: '+req.user);
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







module.exports = router;

