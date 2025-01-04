import express from "express";
import { createTestCase} from "../controllers/TestCasesController.js";

const router = express.Router();


router.post("/", createTestCase);


export default router;
