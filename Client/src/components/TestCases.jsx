import { useState, useEffect } from "react";
import {  Button, Card, Row, Col, Form, Spinner } from "react-bootstrap";

function TestCases() {
    const [testCases, setTestCases] = useState([]);
    const [experiments, setExperiments] = useState([]);
    const [experimentId, setExperimentId] = useState("");
    const [input, setInput] = useState("");
    const [expectedOutput, setExpectedOutput] = useState("");
    const [error, setError] = useState("");
    const [selectedModel, setSelectedModel] = useState("gpt-3.5-turbo");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetch("http://localhost:5000/api/experiments")
            .then((res) => res.json())
            .then((data) => setExperiments(data))
            .catch((err) => console.error("Failed to fetch experiments", err));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!experimentId || input.trim() === "" || expectedOutput.trim() === "") {
            setError("All fields are required.");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/testcases", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ experimentId, input, expectedOutput }),
            });

            if (response.ok) {
                const newTestCase = await response.json();
                setTestCases([...testCases, newTestCase]);
                setExperimentId("");
                setInput("");
                setExpectedOutput("");
                setError("");
            } else {
                setError("Error creating test case");
            }
        } catch (error) {
            setError("Failed to create test case. Please try again later.");
        }
    };

    const executeTests = async () => {
        if (!experimentId) {
            alert("Please select an experiment before executing the tests.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch("http://localhost:5000/api/llm/execute", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    experimentId,
                    model: selectedModel,
                    llmProvider: selectedModel,
                }),
            });

            if (response.ok) {
                const result = await response.json();
                alert("Tests executed successfully!");
            } else {
                alert("Error executing tests");
            }
        } catch (error) {
            alert("Error executing tests: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <h2>Create Test Case</h2>
            <Form onSubmit={handleSubmit} className="mb-4">
                <Row className="mb-3">
                    <Col>
                        <Form.Group>
                            <Form.Label>Experiment</Form.Label>
                            <Form.Control as="select" value={experimentId} onChange={(e) => setExperimentId(e.target.value)}>
                                <option value="">Select an Experiment</option>
                                {experiments.map((exp) => (
                                    <option key={exp.id} value={exp.id}>
                                        {exp.name}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col>
                        <Form.Group>
                            <Form.Label>Test Case Input</Form.Label>
                            <Form.Control
                                as="textarea"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Enter input for the test case"
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col>
                        <Form.Group>
                            <Form.Label>Expected Output</Form.Label>
                            <Form.Control
                                as="textarea"
                                value={expectedOutput}
                                onChange={(e) => setExpectedOutput(e.target.value)}
                                placeholder="Enter expected output"
                            />
                        </Form.Group>
                    </Col>
                </Row>

                {/* Model selection moved above the submit button */}
                <Row className="mb-3">
                    <Col>
                        <Form.Label>Select Model for Test Execution</Form.Label>
                        <Form.Select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)} className="mb-3">
                            <option value="gpt-3.5-turbo">GPT-3.5 Turbo (OpenAI)</option>
                            <option value="google_gemini">Google Gemini</option>
                            <option value="anthropic">Anthropic</option>
                        </Form.Select>
                    </Col>
                </Row>

                <Button type="submit" variant="primary">Create Test Case</Button>
            </Form>

            {error && <p className="text-danger">{error}</p>}

            <h3>Test Cases</h3>
            <ul>
                {testCases.map((test) => (
                    <li key={test.id}>
                        <Card>
                            <Card.Body>
                                <Card.Title>{test.input}</Card.Title>
                                <Card.Text>{test.expectedOutput}</Card.Text>
                            </Card.Body>
                        </Card>
                    </li>
                ))}
            </ul>

            <Button onClick={executeTests} variant="success" disabled={loading}>
                {loading ? <Spinner animation="border" size="sm" /> : 'Execute Tests'}
            </Button>
        </div>
    );
}

export default TestCases;
