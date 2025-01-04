import db from "../models/index.js";

const { Response } = db;

export const getStatistics = async (req, res) => {
    try {
        const { experimentId } = req.query;

        if (!experimentId) {
            return res.status(400).json({ error: "expérience ID  is required." });
        }

        const responses = await Response.findAll({ where: { experimentId } });

        if (responses.length === 0) {
            return res.status(404).json({ error: "NO response founded for this  experience." });
        }


        const totalTestCases = responses.length;
        const exactMatches = responses.filter((response) => response.score === 1).length;
        const exactMatchPercentage = ((exactMatches / totalTestCases) * 100).toFixed(2);

        const modelDistribution = responses.reduce((acc, response) => {
            if (!acc[response.model]) {
                acc[response.model] = { total: 0, exactMatches: 0 };
            }
            acc[response.model].total += 1;
            if (response.score === 1) {
                acc[response.model].exactMatches += 1;
            }
            return acc;
        }, {});

        return res.status(200).json({
            totalTestCases,
            exactMatchPercentage,
            modelDistribution,
        });
    } catch (error) {
        console.error("Error during s statistics reception :", error);
        res.status(500).json({ error: "Error during s statistics reception" });
    }
};
