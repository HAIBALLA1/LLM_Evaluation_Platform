import db from "../models/index.js"; // Importer la base de données et les modèles
const { TestCase, Experiment } = db;


export const createTestCase = async (req, res) => {
    try {
        const { experimentId, input, expectedOutput } = req.body;

        const experiment = await Experiment.findByPk(experimentId);
        if (!experiment) {
            return res.status(404).json({ error: "Experiment not found" });
        }

        const newTestCase = await TestCase.create({ experimentId, input, expectedOutput });

        return res.status(201).json(newTestCase);
    } catch (error) {
        console.error("Error creating test case:", error);
        return res.status(500).json({ error: "Error creating test case" });
    }
};
