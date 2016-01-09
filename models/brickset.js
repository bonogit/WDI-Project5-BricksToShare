'use strict';
module.exports = function(sequelize, DataTypes) {
  var brickset = sequelize.define('brickset', {
    set_id: DataTypes.STRING,
    descr: DataTypes.STRING,
    theme: DataTypes.STRING,
    year: DataTypes.INTEGER,
    img_tn: DataTypes.STRING,
    img_sm: DataTypes.STRING,
    img_big: DataTypes.STRING,
    own: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    want: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    counter: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        brickset.belongsToMany(models.user, {
          through: "ownership",
          foreignKey: "bricksetId"
        });
      }
    }
  });
  return brickset;
};