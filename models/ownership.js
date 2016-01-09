'use strict';
module.exports = function(sequelize, DataTypes) {
  var ownership = sequelize.define('ownership', {
    userId: DataTypes.INTEGER,
    bricksetId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return ownership;
};