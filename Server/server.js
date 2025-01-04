import express from "express";
import cors from "cors";
import experimentRoutes from "./routes/experiments.js";
import metricsRoutes from "./routes/metricsRoute.js";
import llmRoutes from "./routes/llmRoute.js"; // Import llmRoute for LLM execution
import testCaseRoutes from "./routes/testCasesRoute.js"; // Import the new route for test cases
import responseRoutes from "./routes/responseRoutes.js";

const app = express();

// Middleware CORS - Allow cross-origin requests from your front-end
const corsOptions = {
    origin: "http://localhost:5173", // Frontend URL
    methods: "GET,POST,PUT,DELETE", // Allowed HTTP methods
    allowedHeaders: "Content-Type,Authorization", // Allowed headers
};
app.use(cors(corsOptions));

// Middleware to parse JSON requests
app.use(express.json());

// Middleware for logging incoming requests (for debugging)
app.use((req, res, next) => {
    console.log(`Request received: ${req.method} ${req.url}`);
    console.log("Request body:", req.body);
    next();
});

// Routes
app.use("/api/experiments", experimentRoutes); // Routes for managing experiments
app.use("/api/metrics", metricsRoutes); // Routes for handling metrics data
app.use("/api/llm", llmRoutes); // Routes to execute test cases using LLM models
app.use("/api/testcases", testCaseRoutes); //  for handling test case creation
app.use("/api/responses", responseRoutes);  // Assurez-vous que cette ligne existe pour que les requêtes vers /api/responses/experiment/:experimentId fonctionnent.

// Default route to check server status
app.get("/", (req, res) => {
    res.send("LLM Evaluation Platform API is running!");
});

// 404 Error handler for undefined routes
app.use((req, res) => {
    res.status(404).send({ error: "Route not found" });
});

// Start the server on the specified port (5000)
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});

// Export app for testing purposes
export default app;
