'use strict';

export default {
  async up(queryInterface, Sequelize) {
    // Étape 1 : Ajouter la colonne avec allowNull: true
    await queryInterface.addColumn('Metrics', 'experimentId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Experiments',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });

    // Étape 2 : Ajouter une valeur par défaut aux lignes existantes
    await queryInterface.sequelize.query(`
            UPDATE "Metrics"
            SET "experimentId" = (
                SELECT "id" FROM "Experiments" LIMIT 1
            )
            WHERE "experimentId" IS NULL;
        `);

    // Étape 3 : Rendre la colonne obligatoire
    await queryInterface.changeColumn('Metrics', 'experimentId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Experiments',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Metrics', 'experimentId');
  },
};
