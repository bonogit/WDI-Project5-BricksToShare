'use strict';
module.exports = function(sequelize, DataTypes) {
  var brickset = sequelize.define('brickset', {
    set_id: DataTypes.STRING,
    descr: DataTypes.STRING,
    theme: DataTypes.STRING,
    year: DataTypes.INTEGER,
    img_tn: DataTypes.STRING,
    img_big: DataTypes.STRING,
    img_sm: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.brickset.belongsToMany(models.user, { through: models.ownership });
      }
    }
  });
  return brickset;
};