'use strict';

export default (sequelize, DataTypes) => {
    const Experiment = sequelize.define('Experiment', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        systemPrompt: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    });


    Experiment.associate = (models) => {

        Experiment.hasMany(models.TestCase, {
            foreignKey: 'experimentId',
            as: 'testCases',
            onDelete: 'CASCADE',
        });
    };

    return Experiment;
};
