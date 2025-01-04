import { sendToLLM } from "../utils/llmService.js";
import db from "../models/index.js";

const { TestCase, Response, Metrics } = db;

// Function to calculate the score based on the expected output and the LLM response
const calculateScore = (expectedOutput, llmResponse) => {
    // Clean the input and response by trimming whitespace and converting to lowercase
    const cleanedExpected = expectedOutput.trim().toLowerCase();
    const cleanedResponse = llmResponse.trim().toLowerCase();

    // Log for debugging
    console.log("Expected Output:", cleanedExpected);
    console.log("LLM Response:", cleanedResponse);

    // If the response matches exactly, return a score of 1 (perfect match)
    if (cleanedResponse === cleanedExpected) {
        console.log("Exact match: Score = 1");
        return 1;
    }

    // Check for partial match (the response contains the expected output)
    const partialMatch = cleanedResponse.includes(cleanedExpected);
    if (partialMatch) {
        console.log("Partial match: Score = 0.5");
        return 0.5;
    }

    // No match found
    console.log("No match: Score = 0");
    return 0; // Return 0 if no match
};

// Function to calculate accuracy: percentage of fully correct answers
const calculateAccuracy = (testCases, responses) => {
    const totalTests = testCases.length; // Get the total number of test cases
    const correctTests = responses.filter((response) => response.score === 1).length; // Count the correct responses
    return (correctTests / totalTests) * 100; // Return accuracy as a percentage
};

// Function to calculate relevancy: percentage of responses with partial or full match
const calculateRelevancy = (responses) => {
    // Count the responses that have a score greater than 0 (partial or full match)
    const relevantTests = responses.filter((response) => response.score > 0).length;
    return (relevantTests / responses.length) * 100; // Return relevancy as a percentage
};

// Main function to execute the test cases and calculate metrics
export const executeTestCases = async (req, res) => {
    try {
        // Extract necessary data from the request body
        const { experimentId, model, llmProvider } = req.body;

        // Check if the required parameters (experimentId, model, llmProvider) are provided
        if (!experimentId || !model || !llmProvider) {
            return res.status(400).json({ error: "Experiment ID, model, and LLM provider are required." });
        }

        // Retrieve all test cases associated with the provided experiment ID from the database
        const testCases = await TestCase.findAll({ where: { experimentId } });

        // If no test cases are found, return a 404 error
        if (testCases.length === 0) {
            return res.status(404).json({ error: "No test cases found for this experiment." });
        }

        const startTime = Date.now(); // Record the start time to calculate execution time

        // Process all test cases concurrently using Promise.all for better performance
        const responses = await Promise.all(
            testCases.map(async (testCase) => {
                const { input, expectedOutput } = testCase; // Extract the input and expected output for each test case

                // Send the input to the LLM and receive the response
                const llmResponse = await sendToLLM(input, model, llmProvider);

                let score = null;
                let responseText = null;

                // If the LLM response is successful, calculate the score
                if (llmResponse.success) {
                    responseText = llmResponse.response;
                    score = calculateScore(expectedOutput, responseText); // Calculate score based on the LLM response
                } else {
                    responseText = llmResponse.response;
                    score = 0; // If the response is not successful, assign a score of 0
                }

                // Save the response and score to the database in the Response table
                await Response.create({
                    experimentId,
                    testCaseId: testCase.id,
                    model,
                    response: responseText,
                    score,
                });

                // Return the details of the response including the score
                return { score };
            })
        );

        // Calculate the total execution time by subtracting the start time from the current time
        const executionTime = Date.now() - startTime;

        // Calculate the overall metrics: accuracy and relevancy
        const accuracy = calculateAccuracy(testCases, responses); // Calculate accuracy based on test cases and responses
        const relevancy = calculateRelevancy(responses); // Calculate relevancy based on responses

        // Insert the calculated metrics into the database
        const newMetric = await Metrics.create({
            experimentId,
            model,
            accuracy,
            relevancy,
            timestamp: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        // Return a successful response with the calculated metrics and execution time
        return res.status(200).json({
            message: "Test cases execution has been completed.",
            executionTime, // Total execution time in milliseconds
            accuracy, // Accuracy percentage
            relevancy, // Relevancy percentage
            metrics: newMetric // Inserted metrics
        });
    } catch (error) {
        console.error("Error during test cases execution:", error); // Log any errors that occur during execution
        res.status(500).json({ error: "Error during test cases execution" }); // Return a 500 server error if something went wrong
    }
};
