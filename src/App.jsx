import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

// Pages
import IndexPage from "./pages/auth/IndexPage";
import GoogleCallback from "./pages/auth/GoogleCallback";
import PatientDashboard from "./pages/patient/PatientDashboard";
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";

// Components
import PrivateRoute from "./components/PrivateRoute";

function App() {
  const { user, loading } = useAuth();
  if(loading) return <div className="h-screen flex items-center justify-center font-heading text-emerald-600 font-bold">Initializing CareSync...</div>;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/auth/google/success" element={<GoogleCallback />} />
        
        {/* Protected Routes */}
        <Route path="/patient/*" element={<PrivateRoute role="patient"><PatientDashboard /></PrivateRoute>} />
        <Route path="/doctor/*" element={<PrivateRoute role="doctor"><DoctorDashboard /></PrivateRoute>} />
        <Route path="/admin/*" element={<PrivateRoute role="admin"><AdminDashboard /></PrivateRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
export default App;
