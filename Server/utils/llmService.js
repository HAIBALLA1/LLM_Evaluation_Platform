import OpenAI from 'openai';
import axios from 'axios';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai' // Importing the Google Gemini client

dotenv.config(); // Load environment variables from the .env file

// Initialize OpenAI instance with your API key
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Use the OpenAI API key from the environment variables
});

// Function to call OpenAI API and generate a response
const callOpenAI = async (prompt, model = "gpt-3.5-turbo") => {
    try {
        const result = await openai.chat.completions.create({
            model,
            messages: [{ role: "user", content: prompt }], // Send the user prompt to OpenAI
        });

        // Return the response from OpenAI
        return {
            success: true,
            response: result.choices[0].message.content,
        };
    } catch (error) {
        console.error('Error with OpenAI API:', error.message);
        return {
            success: false,
            response: error.message, // Return the error message if OpenAI API call fails
        };
    }
};

// Function to call Anthropic API and generate a response
const callAnthropic = async (prompt, model = "claude-v1") => {
    try {
        const response = await axios.post(
            'https://api.anthropic.com/v1/completions',
            {
                prompt: `\n\nHuman: ${prompt}\n\nAssistant:`,
                model,
                max_tokens_to_sample: 300, // Limit the number of tokens in the response
            },
            {
                headers: {
                    'x-api-key': process.env.ANTHROPIC_API_KEY, // Use the Anthropic API key from the environment variables
                    'Content-Type': 'application/json',
                },
            }
        );

        // Return the response from Anthropic API
        return {
            success: true,
            response: response.data.completion,
        };
    } catch (error) {
        console.error('Error with Anthropic API:', error.response?.data || error.message);
        return {
            success: false,
            response: error.response?.data || error.message, // Return error message if Anthropic API call fails
        };
    }
};

// Function to call Google Gemini API using the GoogleGenerativeAIClient
const callGoogleGemini = async (prompt) => {
    try {
        const client = new GoogleGenerativeAI({
            apiKey: process.env.GOOGLE_GEMINI_API_KEY, // Use the Google Gemini API key from environment variables
        });

        // Call the Gemini model and pass the prompt
        const response = await client.generateText({
            model: 'gemini-1.5-flash', // You can adjust the model here
            prompt,
            temperature: 0.7, // You can adjust the temperature for creativity
            maxTokens: 300, // Limit the number of tokens in the response
        });

        // Return the response from Google Gemini API
        return {
            success: true,
            response: response.text, // Assuming the response text is in 'text' field
        };
    } catch (error) {
        console.error('Error with Google Gemini API:', error.response?.data || error.message);
        return {
            success: false,
            response: error.response?.data || error.message, // Return error message if Google Gemini API call fails
        };
    }
};

// Main function to select the LLM provider and send the prompt accordingly
export const sendToLLM = async (prompt, model, llmProvider = "openai") => {
    try {
        // Validate the prompt (it must be a non-empty string)
        if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
            throw new Error('The prompt is invalid.');
        }

        // Switch based on the selected LLM provider
        switch (llmProvider.toLowerCase()) {
            case "gpt-3.5-turbo":
                return await callOpenAI(prompt, model); // Call OpenAI API if selected
            case "anthropic":
                return await callAnthropic(prompt, model); // Call Anthropic API if selected
            case "google_gemini":
                return await callGoogleGemini(prompt); // Call Google Gemini API if selected
            default:
                throw new Error(`LLM provider '${llmProvider}' not supported.`); // Throw error if the provider is not supported
        }
    } catch (error) {
        console.error("Error in sendToLLM:", error.message); // Log any error that occurs
        return {
            success: false,
            response: error.message, // Return the error message
        };
    }
};
