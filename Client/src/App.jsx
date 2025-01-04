import Experiments from "./components/Experiments";
import TestCases from "./components/TestCases";
import Metrics from "./components/Metrics";


function App() {
    return (
        <div>
            <header className="header-bar">
                LLM Evaluation Platform
            </header>
            <Experiments/>
            <TestCases/>
            <Metrics/>
        </div>
    );
}


export default App;
