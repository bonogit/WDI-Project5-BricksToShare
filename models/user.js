'use strict';
var bcrypt    = require('bcrypt-nodejs');

module.exports = function(sequelize, DataTypes) {
  var user = sequelize.define('user', {
    email: DataTypes.STRING,
    passwd: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.user.belongsToMany(models.brickset, { through: models.ownership});
      }
    },
    instanceMethods: {
      //generate a hash
      generateHash: function(password){
         return bcrypt.hashSync(password, bcrypt.genSaltSync(8),null);
      },
      //checking if password is valid
      validPassword: function(password){
         return bcrypt.compareSync(password, this.password);
      },
    }
  });

  return user;
};