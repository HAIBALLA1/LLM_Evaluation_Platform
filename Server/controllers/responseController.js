import db from "../models/index.js";
const { Response, Experiment, TestCase } = db;

// Create a new response manually
export const createResponse = async (req, res) => {
    try {
        const { experimentId, testCaseId, model, response, score } = req.body;

        if (!experimentId || !testCaseId || !model || !response) {
            return res.status(400).json({ error: "All required fields are not filled." });
        }

        // Verify that the experiment and test case exist
        const experiment = await Experiment.findByPk(experimentId);
        const testCase = await TestCase.findByPk(testCaseId);

        if (!experiment) {
            return res.status(404).json({ error: "Experiment not found." });
        }

        if (!testCase) {
            return res.status(404).json({ error: "Test case not found." });
        }

        // Save the response to the database
        const newResponse = await Response.create({
            experimentId,
            testCaseId,
            model,
            response,
            score,
        });

        return res.status(201).json({ message: "Response successfully created.", data: newResponse });
    } catch (error) {
        console.error("Error creating response:", error);
        res.status(500).json({ error: "Error creating response." });
    }
};

// List all responses
export const listResponses = async (req, res) => {
    try {
        const responses = await Response.findAll({
            include: [
                { model: Experiment, as: "experiment" },
                { model: TestCase, as: "testCase" },
            ],
        });
        return res.status(200).json(responses);
    } catch (error) {
        console.error("Error fetching responses:", error);
        res.status(500).json({ error: "Error fetching responses." });
    }
};

// Get responses by experiment
export const getResponsesByExperiment = async (req, res) => {
    try {
        const { experimentId } = req.params;
        console.log("Fetching responses for experiment:", experimentId);

        const responses = await Response.findAll({
            where: { experimentId },
            include: [{ model: TestCase, as: "testCase" }],
        });

        console.log("Responses found:", responses);
        return res.status(200).json(responses);
    } catch (error) {
        console.error("Error fetching responses by experiment:", error);
        res.status(500).json({ error: "Error fetching responses by experiment." });
    }
};


