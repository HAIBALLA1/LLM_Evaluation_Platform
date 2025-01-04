'use strict';

export default (sequelize, DataTypes) => {
  const Response = sequelize.define('Response', {
    experimentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Experiments',
        key: 'id',
      },
    },
    testCaseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'TestCases',
        key: 'id',
      },
    },
    model: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    response: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    score: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
  });

  // Associations
  Response.associate = (models) => {
    Response.belongsTo(models.Experiment, {
      foreignKey: 'experimentId',
      as: 'experiment',
    });
    Response.belongsTo(models.TestCase, {
      foreignKey: 'testCaseId',
      as: 'testCase',
    });
  };

  return Response;
};
