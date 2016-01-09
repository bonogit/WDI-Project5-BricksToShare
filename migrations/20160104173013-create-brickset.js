'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('bricksets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      set_id: {
        type: Sequelize.STRING
      },
      descr: {
        type: Sequelize.STRING
      },
      theme: {
        type: Sequelize.STRING
      },
      year: {
        type: Sequelize.INTEGER
      },
      img_tn: {
        type: Sequelize.STRING
      },
      img_sm: {
        type: Sequelize.STRING
      },
      img_big: {
        type: Sequelize.STRING
      },
      own: {
        type: Sequelize.BOOLEAN
      },
      want: {
        type: Sequelize.BOOLEAN
      },
      counter:{
         type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('bricksets');
  }
};