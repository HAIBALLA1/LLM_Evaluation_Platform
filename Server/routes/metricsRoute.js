import express from "express";
import db from "../models/index.js";
import { getStatistics } from "../controllers/metricsController.js";

const router = express.Router();
const { Metrics } = db;

router.get("/", async (req, res) => {
    try {
        const metrics = await Metrics.findAll(); // Récupérer toutes les métriques
        res.status(200).send(metrics);
    } catch (error) {
        console.error("Erreur lors de la récupération des métriques :", error);
        res.status(500).send({ error: "Erreur lors de la récupération des métriques" });
    }
});


router.post("/", async (req, res) => {
    const { experimentId, model, accuracy, relevancy } = req.body;

    if (!experimentId || !model) {
        return res.status(400).send({ error: "experimentId et model sont requis" });
    }

    try {
        const newMetric = await Metrics.create({
            experimentId,
            model,
            accuracy,
            relevancy,
            timestamp: new Date(),
        });

        res.status(201).send({ message: "Métrique créée avec succès", data: newMetric });
    } catch (error) {
        console.error("Erreur lors de la création de la métrique :", error);
        res.status(500).send({ error: "Erreur lors de la création de la métrique" });
    }
});


router.get("/statistics", getStatistics);

export default router;
