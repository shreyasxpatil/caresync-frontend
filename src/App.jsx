import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

// Layouts
import PatientLayout from "./pages/patient/PatientLayout";
import DoctorLayout from "./pages/doctor/DoctorLayout";
import AdminLayout from "./pages/admin/AdminLayout";

// Auth Pages
import IndexPage from "./pages/auth/IndexPage";
import GoogleCallback from "./pages/auth/GoogleCallback";

// Patient Pages
import PatientDashboard from "./pages/patient/PatientDashboard";
import PatientBookAppointment from "./pages/patient/PatientBookAppointment";
import PatientAppointments from "./pages/patient/PatientAppointments";
import PatientPrescriptions from "./pages/patient/PatientPrescriptions";
import PatientProfile from "./pages/patient/PatientProfile";

// Doctor Pages
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import DoctorAppointments from "./pages/doctor/DoctorAppointments";
import DoctorPatients from "./pages/doctor/DoctorPatients";
import DoctorPrescriptions from "./pages/doctor/DoctorPrescriptions";
import DoctorProfile from "./pages/doctor/DoctorProfile";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminDoctors from "./pages/admin/AdminDoctors";
import AdminPatients from "./pages/admin/AdminPatients";
import AdminAppointments from "./pages/admin/AdminAppointments";
import AdminMessages from "./pages/admin/AdminMessages";

// Components
import { PrivateRoute } from "./components/PrivateRoute";
import CareAIChatbot from "./components/CareAIChatbot";

import GlobalLoader from "./components/GlobalLoader";

function App() {
  const { user, loading } = useAuth();
  if (loading) return <GlobalLoader fullScreen text="Initializing CareSync..." />;

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<IndexPage />} />
        <Route path="/auth/google/success" element={<GoogleCallback />} />

        {/* Patient Routes — wrapped in PatientLayout */}
        <Route path="/patient" element={<PrivateRoute roles={["patient"]}><PatientLayout /></PrivateRoute>}>
          <Route index element={<PatientDashboard />} />
          <Route path="book" element={<PatientBookAppointment />} />
          <Route path="appointments" element={<PatientAppointments />} />
          <Route path="prescriptions" element={<PatientPrescriptions />} />
          <Route path="profile" element={<PatientProfile />} />
        </Route>

        {/* Doctor Routes — wrapped in DoctorLayout */}
        <Route path="/doctor" element={<PrivateRoute roles={["doctor"]}><DoctorLayout /></PrivateRoute>}>
          <Route index element={<DoctorDashboard />} />
          <Route path="appointments" element={<DoctorAppointments />} />
          <Route path="patients" element={<DoctorPatients />} />
          <Route path="prescriptions" element={<DoctorPrescriptions />} />
          <Route path="profile" element={<DoctorProfile />} />
        </Route>

        {/* Admin Routes — wrapped in AdminLayout */}
        <Route path="/admin" element={<PrivateRoute roles={["admin"]}><AdminLayout /></PrivateRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="doctors" element={<AdminDoctors />} />
          <Route path="patients" element={<AdminPatients />} />
          <Route path="appointments" element={<AdminAppointments />} />
          <Route path="messages" element={<AdminMessages />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Global Floating Chatbot */}
      <CareAIChatbot />
    </Router>
  );
}
export default App;
