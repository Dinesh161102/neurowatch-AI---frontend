import "@/App.css";
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Layout from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import Patients from "@/pages/Patients";
import SignalUpload from "@/pages/SignalUpload";
import BrainActivity from "@/pages/BrainActivity";
import SignalVisualizer from "@/pages/SignalVisualizer";
import AIAnalysis from "@/pages/AIAnalysis";
import Predictions from "@/pages/Predictions";
import Explainability from "@/pages/Explainability";
import Reports from "@/pages/Reports";
import Settings from "@/pages/Settings";

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={<Login />} />

                    <Route element={<Layout />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/patients" element={<Patients />} />
                        <Route path="/signal-upload" element={<SignalUpload />} />
                        <Route path="/brain-activity" element={<BrainActivity />} />
                        <Route path="/signal-visualizer" element={<SignalVisualizer />} />
                        <Route path="/ai-analysis" element={<AIAnalysis />} />
                        <Route path="/predictions" element={<Predictions />} />
                        <Route path="/explainability" element={<Explainability />} />
                        <Route path="/reports" element={<Reports />} />
                        <Route path="/settings" element={<Settings />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;