'use strict';

export default {
  async up(queryInterface) {
    await queryInterface.removeColumn('prompts', 'userId');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('prompts', 'userId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    });
  },
};
