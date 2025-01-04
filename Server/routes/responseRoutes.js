import express from "express";
import {
    createResponse,
    listResponses,
    getResponsesByExperiment,
} from "../controllers/responseController.js";

const router = express.Router();


router.post("/", createResponse);
router.get("/", listResponses);
router.get("/experiment/:experimentId", getResponsesByExperiment);


export default router;
