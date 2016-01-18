var express = require('express');
var router = express.Router();
var models = require('../models/index');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
// require('../config/passport')(passport);


//for include syntax
var userModel = models.user;
var currentUserId = 1;


  // if user is authenticated in the session, call the next() to call the next request handler 
  // Passport adds this method to request object. A middleware is allowed to add properties to
  // request and response objects
var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())
    return next();
  // if the user is not authenticated then redirect him to the login page
  res.redirect('/users/signup');
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
        where: {want: true},
      }).then(function(topWantSets){
        models.brickset.findAll({
          attributes:['set_id','descr','img_sm'
          ,[models.sequelize.fn('COUNT',models.sequelize.col('counter')),'count']      
          ],
          limit: 10,
          group: ['set_id','descr','img_sm'],
          order: 'count DESC',
          where: {own: true}
        }).then(function(topOwnSets){
            models.story.findAll({
              attributes: ['id','title','source','img_src','contents','updatedAt','like_count'],
              limit: 4
        }).then(function(story){
            models.like.count({
              where:{storyId: 1}
        }).then(function(story1Like){
            models.like.count({
              where: {storyId: 2}
        }).then(function(story2Like){
            models.like.count({
              where: {storyId: 3}
        }).then(function(story3Like){
            models.like.count({
              where: {storyId: 4}
        }).then(function(story4Like){
          var storyLike = [story1Like,story2Like,story3Like,story4Like]; 
          res.render('index',{
            topWantSets: topWantSets,
            topOwnSets: topOwnSets,
            story: story,
            storyLike: storyLike
          });
        });
       });   
      });    
     }); 
     });
    });
  });
});




//page for sets view
router.get('/setsview',isAuthenticated,function(req,res){
  currentUserId = parseInt(req.session.passport.user);
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
        models.user.find({
          where: {id: currentUserId}
     }).then(function(currentUser){
        // console.log('currentUser email'+currentUser.email);
        res.render('setsview',{
            legoSets: legoSets.rows,
            resultNo: countSum,
            themeTag: themeTag,
            currentUserName: currentUser.email
          });  
       });
     });   
    });
  });
});
//for pagination on sets view
router.get('/setsview/:id',isAuthenticated,function(req,res){
  currentUserId = parseInt(req.session.passport.user);
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
        models.user.find({
          where: {id: currentUserId}
     }).then(function(currentUser){
        res.render('setsview',{
            legoSets: legoSets,
            resultNo: countSum,
            themeTag: themeTag,
            currentUserName: currentUser.email
          });  
      });
     });   
    });
  });
});


//for sets view search
router.get('/search',isAuthenticated,function(req,res){
  currentUserId = parseInt(req.session.passport.user);
  models.brickset.findAll({
    where: {
      theme: req.query.key,
      $and: [{own: false},{want: false}]     
    },
     limit: 10,
      offset: 0
  }).then(function(searchByTheme){
      models.user.find({
        where: {id: currentUserId}
    }).then(function(currentUser){
    res.render('search',{
      dataByTheme: searchByTheme,
      resultNo: searchByTheme.length,
      themeName: req.query.key,
      currentUserName: currentUser.email
    });
    });
  });
});

//for pagination on sets search
router.get('/search/:id',isAuthenticated,function(req,res){
  currentUserId = parseInt(req.session.passport.user);
  var offsetNo = (parseInt(req.params.id)-1)*10;
  models.brickset.findAll({
    where: {
      theme: req.query.key,
      $and: [{own: false},{want: false}]     
    },
     limit: 10,
      offset: offsetNo
  }).then(function(searchByTheme){
      models.user.find({
        where: {id: currentUserId}
    }).then(function(currentUser){
    res.render('search',{
      dataByTheme: searchByTheme,
      resultNo: searchByTheme.length,
      themeName: req.query.key,
      currentUserName: currentUser.email
    });
    });
  });
});



//show single set
router.get('/singleset/:id',isAuthenticated,function(req,res){
  currentUserId = parseInt(req.session.passport.user);
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
          where: {id: currentUserId}
        }]
    }).then(function(checkOwnSum){
      models.user.find({
        where: {id: currentUserId}
    }).then(function(currentUser){
      // console.log('records of want is:'+ownData.count);
      res.render('singleset',{
      singleset: singleset,
      ownCount: ownCount,
      wantCount: wantCount,
      checkOwnSum: checkOwnSum,
      currentUserName: currentUser.email,
      currentUserId: currentUser.id
      });
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
router.get('/mysets',isAuthenticated,function(req,res){
currentUserId = parseInt(req.session.passport.user);
// console.log(currentUserId);
  models.brickset.findAndCountAll({
    where:{
      own: true
    },
    include:[{
          model: userModel,
          where: {id: currentUserId}
        }]
  }).then(function(ownData){
      models.brickset.findAndCountAll({
      where: {
        want: true
      },
        include:[{
          model: userModel,
          where: {id: currentUserId}
        }]
  }).then(function(wantData){
        models.user.find({
          where: {id: currentUserId}
     }).then(function(currentUser){
        res.render('mysets',{
          ownData: ownData.rows,
          wantData: wantData.rows,
          recordCount: ownData.count+wantData.count,
          currentUserName: currentUser.email
        });
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

//render page for new story
router.get('/newstory',isAuthenticated,function(req,res){
  currentUserId = parseInt(req.session.passport.user);
  var story = models.story;
  models.like.findAll({
    include: [{
      model: story
    }]
  }).then(function(story){
       models.user.find({
        where: {id: currentUserId}
  }).then(function(currentUser){
    res.render('newstory',{
      currentUserName: currentUser.email 
    });
  });
 }); 
});

router.post('/updatestory',function(req,res){
  models.story.create({
    title: req.body.title,
    source: req.body.author,
    img_src: req.body.image_src,
    contents: req.body.content
  }).then(function(newstory){
    // res.json(newstory);
    res.redirect('/');
  });
});

//add like
router.post('/newstory/addlike',function(req,res){

   models.like.create({
      storyId: req.body.storyId
  }).then(function(newLike){
    res.json(newLike);
  });
});

module.exports = router;

