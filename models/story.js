'use strict';
module.exports = function(sequelize, DataTypes) {
  var story = sequelize.define('story', {
    title: DataTypes.STRING,
    source: DataTypes.STRING,
    img_src: DataTypes.STRING,
    contents: DataTypes.TEXT,
    likeId: DataTypes.INTEGER,
    like_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        story.hasMany(models.like,{as:'likes'});
      }
    }
  });
  return story;
};