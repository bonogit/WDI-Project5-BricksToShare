'use strict';
module.exports = function(sequelize, DataTypes) {
  var ownership = sequelize.define('ownership', {
    user_Id: DataTypes.INTEGER,
    brickset_Id: DataTypes.INTEGER,
    set_id: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return ownership;
};