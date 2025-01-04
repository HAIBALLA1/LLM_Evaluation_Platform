'use strict';

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('TestCases', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      experimentId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Experiments', // Clé étrangère vers la table Experiments
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      input: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      expectedOutput: {
        type: Sequelize.TEXT,
        allowNull: false,
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
    await queryInterface.dropTable('TestCases');
  },
};
