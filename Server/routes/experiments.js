import express from "express";
import { createExperiment, listExperiments } from "../controllers/experimentsController.js";

const router = express.Router();


router.post("/", createExperiment);
router.get("/", listExperiments);

export default router;
