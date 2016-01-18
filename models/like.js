'use strict';
module.exports = function(sequelize, DataTypes) {
  var like = sequelize.define('like', {
    storyId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        like.hasOne(models.story);
      }
    }
  });
  return like;
};