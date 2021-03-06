'use strict';
module.exports = function(sequelize, DataTypes) {
  var user = sequelize.define('user', {
    email: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        user.belongsToMany(models.brickset,{
         foreignKey: "userId",
         through: "ownership"
       });
      }
    }
  });
  return user;
};