import db from "../models/index.js";
const { Experiment, TestCase } = db;


export const createExperiment = async (req, res) => {
    try {
        const { name, systemPrompt } = req.body;
        const experiment = await Experiment.create({ name, systemPrompt });
        res.status(201).json(experiment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


export const listExperiments = async (req, res) => {
    try {
        const experiments = await Experiment.findAll();
        res.status(200).json(experiments);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};




