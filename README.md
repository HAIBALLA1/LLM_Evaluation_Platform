# LLM Evaluation Platform

This project is an **LLM Evaluation Platform**, a web-based application to evaluate different Large Language Models (LLMs). The platform allows users to manage experiments, create test cases, and evaluate LLM models like OpenAI's GPT-3.5, Google Gemini, and others, displaying results such as accuracy, relevance, and execution time.

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)

## Project Overview

The **LLM Evaluation Platform** is designed to help researchers, developers, and engineers evaluate different LLMs by providing a centralized interface to perform experiments, test models, and get metrics such as accuracy, relevance, and execution time. The platform allows you to:

- Manage multiple experiments
- Create test cases with inputs and expected outputs
- Execute tests on different LLMs (such as GPT-3.5 Turbo, Google Gemini, Anthropic)
- View and track the results of the evaluations with metrics

## Features

- **Experiment Management**: Create and view experiments that define the system prompt and other parameters for the test cases.
- **Test Case Creation**: Create custom test cases by specifying the input and expected output.
- **Model Evaluation**: Execute the test cases on different LLM models and get feedback on their performance.
- **Metrics Display**: View metrics such as **Accuracy**, **Relevance**, and **Execution Time** for each model tested.
- **Responsive Design**: Fully responsive layout to ensure usability across desktop and mobile devices.
- **User-Friendly Interface**: Easy-to-use interface with clear navigation.

## Technologies Used

### Frontend

- **React**: A JavaScript library for building user interfaces.
- **Bootstrap**: Frontend framework for responsive design.
- **React Bootstrap**: Bootstrap components for React.
- **Axios**: Promise-based HTTP client for making API requests.

### Backend

- **Node.js**: JavaScript runtime used for backend development.
- **Express.js**: Web application framework for Node.js.
- **Sequelize**: Promise-based Node.js ORM for relational databases (PostgreSQL).
- **PostgreSQL**: Relational database used for storing experiments, test cases, and results.

### APIs

- **OpenAI GPT-3.5**: Used for testing the GPT-3.5 Turbo model.
- **Google Gemini**: Used for testing Google's Gemini model.
- **Anthropic**: Used for testing Anthropic's Claude model.

## Installation

### Prerequisites

Before you start, make sure you have the following installed:

- **Node.js** and **npm**: Node.js runtime and package manager.
- **PostgreSQL**: A PostgreSQL database instance for storing data.
  
### Installation Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/LLM_Evaluation_Platform.git
