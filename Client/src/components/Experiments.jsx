import { useState, useEffect } from "react";
import { Pagination, Button, Card, Row, Col, Form } from "react-bootstrap";

function Experiments() {
    const [experiments, setExperiments] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const experimentsPerPage = 6;
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false); // État pour afficher/masquer le formulaire
    const [newExperiment, setNewExperiment] = useState({ name: "", systemPrompt: "" });


    useEffect(() => {
        fetch("http://localhost:5000/api/experiments")
            .then((res) => res.json())
            .then((data) => setExperiments(data))
            .catch((err) => console.error("Failed to fetch experiments", err));
    }, []);


    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const indexOfLastExperiment = currentPage * experimentsPerPage;
    const indexOfFirstExperiment = indexOfLastExperiment - experimentsPerPage;
    const currentExperiments = experiments.slice(indexOfFirstExperiment, indexOfLastExperiment);


    const handleCreateExperiment = (e) => {
        e.preventDefault();
        fetch("http://localhost:5000/api/experiments", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newExperiment),
        })
            .then((res) => res.json())
            .then((data) => {
                setExperiments([...experiments, data]);
                setShowForm(false);
                setNewExperiment({ name: "", systemPrompt: "" });
            })
            .catch((err) => console.error("Error creating experiment", err));
    };

    const handleViewResults = (experimentId) => {
        setLoading(true);
        fetch(`http://localhost:5000/api/responses/experiment/${experimentId}`)
            .then((res) => res.json())
            .then((data) => {
                setResults(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to fetch results", err);
                setLoading(false);
            });
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Existing Experiments</h2>

            {/* Bouton pour afficher le formulaire */}
            <div className="text-center mb-4">
                <Button variant="success" size="lg" onClick={() => setShowForm(!showForm)}>
                    {showForm ? "Cancel" : "Create New Experiment"}
                </Button>
            </div>

            {/* Formulaire d'ajout d'une nouvelle expérience */}
            {showForm && (
                <Form onSubmit={handleCreateExperiment}>
                    <Row className="mb-3">
                        <Col>
                            <Form.Group>
                                <Form.Label>Experiment Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={newExperiment.name}
                                    onChange={(e) => setNewExperiment({ ...newExperiment, name: e.target.value })}
                                    placeholder="Enter experiment name"
                                    required
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col>
                            <Form.Group>
                                <Form.Label>System Prompt</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={newExperiment.systemPrompt}
                                    onChange={(e) => setNewExperiment({ ...newExperiment, systemPrompt: e.target.value })}
                                    placeholder="Enter the system prompt"
                                    required
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Button variant="primary" type="submit">
                        Create Experiment
                    </Button>
                </Form>
            )}

            <Row>
                {currentExperiments.map((exp) => (
                    <Col key={exp.id} md={4} className="mb-4">
                        <Card className="shadow-sm h-100">
                            <Card.Body>
                                <Card.Title className="text-primary">{exp.name}</Card.Title>
                                <Card.Text>{exp.systemPrompt}</Card.Text>
                                <Button variant="primary" onClick={() => handleViewResults(exp.id)} className="w-100">
                                    {results && results.experimentId === exp.id
                                        ? "Hide Results"
                                        : "View Results"}
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Display Results for the clicked experiment */}
            {loading ? (
                <p>Loading results...</p>
            ) : (
                results && (
                    <div>
                        <h3>Results for Experiment {results[0]?.experimentId}</h3>
                        <div className="results-container">
                            {results.map((result) => (
                                <div key={result.id} className="result-card">
                                    <h4>Test Case: {result.testCase.input}</h4>
                                    <p>Expected Output: {result.testCase.expectedOutput}</p>
                                    <p>Response: {result.response}</p>
                                    <p>Score: {result.score}</p>
                                    <p>Model: {result.model}</p>
                                    <p>Timestamp: {new Date(result.createdAt).toLocaleString()}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )
            )}


            <Pagination className="justify-content-center">
                {[...Array(Math.ceil(experiments.length / experimentsPerPage))].map((_, index) => (
                    <Pagination.Item
                        key={index}
                        onClick={() => handlePageChange(index + 1)}
                        active={index + 1 === currentPage}
                    >
                        {index + 1}
                    </Pagination.Item>
                ))}
            </Pagination>
        </div>
    );
}

export default Experiments;
