import { useState, useEffect } from "react";
import { Spinner, Table, Alert } from "react-bootstrap";

function Metrics() {
    const [metrics, setMetrics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch metrics data from the API
        fetch("http://localhost:5000/api/metrics")
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Failed to fetch metrics");
                }
                return res.json();
            })
            .then((data) => {
                setMetrics(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div className="text-center mt-5"><Spinner animation="border" variant="primary" /> Loading metrics...</div>;
    }

    if (error) {
        return <Alert variant="danger" className="mt-5">{error}</Alert>;
    }

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Model Metrics</h2>
            {metrics.length === 0 ? (
                <Alert variant="info" className="text-center">No metrics available.</Alert>
            ) : (
                <Table striped bordered hover responsive variant="light">
                    <thead>
                    <tr>
                        <th>Model</th>
                        <th>Accuracy (%)</th>
                        <th>Relevancy (%)</th>
                        <th>Execution Time</th>
                    </tr>
                    </thead>
                    <tbody>
                    {metrics.map((metric) => (
                        <tr key={metric.id}>
                            <td>{metric.model}</td>
                            <td>{metric.accuracy ? metric.accuracy.toFixed(2) + "%" : "N/A"}</td>
                            <td>{metric.relevancy ? metric.relevancy.toFixed(2) + "%" : "N/A"}</td>
                            <td>{metric.executionTime ? `${metric.executionTime} seconds` : "Not available"}</td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            )}
        </div>
    );
}

export default Metrics;
