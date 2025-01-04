'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('metrics', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      promptId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'prompts',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      model: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      accuracy: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      relevancy: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('metrics');
  },
};
