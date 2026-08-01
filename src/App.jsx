import { Suspense, lazy } from "react";
import "@/App.css";
import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";

const Landing = lazy(() => import("@/pages/Landing"));
const Login = lazy(() => import("@/pages/Login"));
const Layout = lazy(() => import("@/components/Layout"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Patients = lazy(() => import("@/pages/Patients"));
const SignalUpload = lazy(() => import("@/pages/SignalUpload"));
const BrainActivity = lazy(() => import("@/pages/BrainActivity"));
const SignalVisualizer = lazy(() => import("@/pages/SignalVisualizer"));
const AIAnalysis = lazy(() => import("@/pages/AIAnalysis"));
const Predictions = lazy(() => import("@/pages/Predictions"));
const Explainability = lazy(() => import("@/pages/Explainability"));
const Reports = lazy(() => import("@/pages/Reports"));
const Settings = lazy(() => import("@/pages/Settings"));

function LoadingFallback() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 text-cyan-400">
            <div className="text-lg font-medium">Loading experience...</div>
        </div>
    );
}

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Suspense fallback={<LoadingFallback />}>
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
                </Suspense>
            </BrowserRouter>
        </div>
    );
}

export default App;