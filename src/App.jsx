import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { PrivateRoute, PublicRoute } from './components/PrivateRoute';
import CareAIChatbot from './components/CareAIChatbot';
import './index.css';

// Sophisticated Loading Component
const PageLoader = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 gap-4">
    <div className="relative size-16">
      <div className="absolute inset-0 border-4 border-emerald-100 rounded-full"></div>
      <div className="absolute inset-0 border-4 border-emerald-600 rounded-full border-t-transparent animate-spin"></div>
    </div>
    <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] animate-pulse">Initializing CareSync</div>
  </div>
);

// Public pages
const IndexPage = lazy(() => import('./pages/auth/IndexPage'));
const PatientLoginPage = lazy(() => import('./pages/auth/PatientLoginPage'));
const GoogleCallback = lazy(() => import('./pages/auth/GoogleCallback'));

// Admin pages
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminDoctors = lazy(() => import('./pages/admin/AdminDoctors'));
const AdminPatients = lazy(() => import('./pages/admin/AdminPatients'));
const AdminAppointments = lazy(() => import('./pages/admin/AdminAppointments'));
const AdminMessages = lazy(() => import('./pages/admin/AdminMessages'));

// Doctor pages
const DoctorLayout = lazy(() => import('./pages/doctor/DoctorLayout'));
const DoctorDashboard = lazy(() => import('./pages/doctor/DoctorDashboard'));
const DoctorAppointments = lazy(() => import('./pages/doctor/DoctorAppointments'));
const DoctorPatients = lazy(() => import('./pages/doctor/DoctorPatients'));
const DoctorPrescriptions = lazy(() => import('./pages/doctor/DoctorPrescriptions'));
const DoctorProfile = lazy(() => import('./pages/doctor/DoctorProfile'));

// Patient pages
const PatientLayout = lazy(() => import('./pages/patient/PatientLayout'));
const PatientDashboard = lazy(() => import('./pages/patient/PatientDashboard'));
const PatientBookAppointment = lazy(() => import('./pages/patient/PatientBookAppointment'));
const PatientAppointments = lazy(() => import('./pages/patient/PatientAppointments'));
const PatientPrescriptions = lazy(() => import('./pages/patient/PatientPrescriptions'));
const PatientProfile = lazy(() => import('./pages/patient/PatientProfile'));

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: '#1e293b', color: '#f1f5f9', border: '1px solid #334155' },
            success: { iconTheme: { primary: '#10b981', secondary: '#f1f5f9' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#f1f5f9' } },
          }}
        />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public */}
            <Route path="/" element={<PublicRoute><IndexPage /></PublicRoute>} />
            <Route path="/patient-login" element={<PublicRoute><PatientLoginPage /></PublicRoute>} />
            <Route path="/auth/google/success" element={<GoogleCallback />} />

            {/* Admin */}
            <Route path="/admin" element={<PrivateRoute roles={['admin']}><AdminLayout /></PrivateRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="doctors" element={<AdminDoctors />} />
              <Route path="patients" element={<AdminPatients />} />
              <Route path="appointments" element={<AdminAppointments />} />
              <Route path="messages" element={<AdminMessages />} />
            </Route>

            {/* Doctor */}
            <Route path="/doctor" element={<PrivateRoute roles={['doctor']}><DoctorLayout /></PrivateRoute>}>
              <Route index element={<DoctorDashboard />} />
              <Route path="appointments" element={<DoctorAppointments />} />
              <Route path="patients" element={<DoctorPatients />} />
              <Route path="prescriptions" element={<DoctorPrescriptions />} />
              <Route path="profile" element={<DoctorProfile />} />
            </Route>

            {/* Patient */}
            <Route path="/patient" element={<PrivateRoute roles={['patient']}><PatientLayout /></PrivateRoute>}>
              <Route index element={<PatientDashboard />} />
              <Route path="book" element={<PatientBookAppointment />} />
              <Route path="appointments" element={<PatientAppointments />} />
              <Route path="prescriptions" element={<PatientPrescriptions />} />
              <Route path="profile" element={<PatientProfile />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>

        {/* AI Care: Global Persistent Chatbot Overlay */}
        <CareAIChatbot />
      </AuthProvider>
    </BrowserRouter>
  );
}
