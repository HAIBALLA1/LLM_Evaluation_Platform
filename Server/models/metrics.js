'use strict';

export default (sequelize, DataTypes) => {
    const Metrics = sequelize.define('Metrics', {
        experimentId: { // Remplacement de promptId par experimentId
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Experiments', // Référence la table Experiments
                key: 'id',
            },
        },
        model: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        accuracy: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        relevancy: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        timestamp: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    });

    Metrics.associate = (models) => {
        Metrics.belongsTo(models.Experiment, {
            foreignKey: 'experimentId',
            as: 'experiment',
        });
    };

    return Metrics;
};
