export default (sequelize, DataTypes) => {
    const TestCase = sequelize.define("TestCase", {
        input: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        expectedOutput: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        experimentId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "Experiments",
                key: "id",
            },
        },
    });

    TestCase.associate = (models) => {
        TestCase.belongsTo(models.Experiment, {
            foreignKey: "experimentId",
            as: "experiment",
        });
    };

    return TestCase;
};
