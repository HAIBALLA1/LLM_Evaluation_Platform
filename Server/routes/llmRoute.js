import express from "express";
import { executeTestCases } from "../controllers/llmController.js";

const router = express.Router();

router.post("/execute", executeTestCases);

export default router;
