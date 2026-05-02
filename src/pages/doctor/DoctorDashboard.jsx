import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import PatientTable from '../../components/doctor/PatientTable';
import PatientHistoryPanel from '../../components/doctor/PatientHistoryPanel';

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Panel State
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Editable Profile/Schedule State
  const [schedule, setSchedule] = useState({
    consultationFee: user?.consultationFee || 150,
    acceptWalkIns: true,
    virtualConsults: true
  });

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await api.get('/doctors/me/appointments');
      setAppointments(res.data.appointments || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (appointmentId) => {
    try {
      toast.success('Appointment Accepted');
      setAppointments(appointments.map(app => app._id === appointmentId ? { ...app, status: 'confirmed' } : app));
    } catch (error) {
      toast.error('Failed to accept appointment');
    }
  };

  const handleReject = async (appointmentId) => {
    try {
      toast.success('Appointment Rejected');
      setAppointments(appointments.map(app => app._id === appointmentId ? { ...app, status: 'cancelled' } : app));
    } catch (error) {
      toast.error('Failed to reject appointment');
    }
  };

  const handleUpdateSettings = async (e) => {
    e.preventDefault();
    toast.success('Settings updated successfully');
  };

  const handlePatientClick = (patient) => {
    setSelectedPatient(patient);
    setIsPanelOpen(true);
  };

  const pendingAppointments = appointments.filter(a => a.status === 'pending');
  const otherAppointments = appointments.filter(a => a.status !== 'pending');

  return (
    <>
      <section className="mb-12">
        <h1 className="text-slate-900 font-extrabold text-4xl mb-2">
          Good Morning, Dr. {user?.lastName || 'Chen'}
        </h1>
        <p className="font-body-base text-body-base text-slate-500 mt-1">
          You have {appointments.length} appointments scheduled for today. {schedule.virtualConsults && "Virtual consultations are enabled."}
        </p>
      </section>

      <div className="grid grid-cols-12 gap-8">
        
        {/* Left Column: Queue & History */}
        <div className="col-span-12 xl:col-span-8 space-y-12">
          
          {/* Appointment Queue */}
          <section>
            <div className="flex justify-between items-end mb-6">
              <h2 className="font-headline-sm text-headline-sm text-text-primary">Pending Queue</h2>
              <button className="text-primary font-label text-sm hover:underline cursor-pointer">View All</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {loading ? (
                <p className="text-slate-500 text-sm">Loading pending queue...</p>
              ) : pendingAppointments.length === 0 ? (
                <p className="text-slate-500 text-sm italic col-span-full border p-4 border-dashed rounded-lg">No pending appointment requests.</p>
              ) : (
                pendingAppointments.map(app => (
                  <div key={app._id} className="bg-surface border border-border-structural rounded-lg p-5 shadow-clinical flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-lg overflow-hidden bg-slate-200 shrink-0 border border-slate-100">
                        <img 
                          alt="Patient" 
                          className="w-full h-full object-cover" 
                          loading="lazy"
                          src={app.patient?.avatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=75&fm=webp"} 
                        />
                      </div>
                      <div>
                        <h3 className="font-headline-sm text-base text-text-primary">{app.patient?.firstName} {app.patient?.lastName}</h3>
                        <p className="text-xs font-label text-slate-500 uppercase tracking-tight">{app.reason || 'Checkup'} • {app.appointmentTime}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleAccept(app._id)} 
                        className="flex-1 bg-primary text-white py-2.5 rounded-lg font-button text-xs uppercase tracking-widest hover:bg-opacity-90 active:scale-95 transition-all cursor-pointer"
                      >
                        Accept
                      </button>
                      <button 
                        onClick={() => handleReject(app._id)} 
                        className="flex-1 bg-slate-100 text-slate-500 py-2.5 rounded-lg font-button text-xs uppercase tracking-widest hover:bg-slate-200 active:scale-95 transition-all cursor-pointer"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Patient History Table */}
          <section>
            <div className="bg-white border border-border-structural rounded-lg overflow-hidden shadow-clinical">
              <div className="px-6 py-4 border-b border-border-structural flex justify-between items-center">
                <h2 className="font-headline-sm text-headline-sm text-text-primary">Recent Patient Encounters</h2>
                <span className="material-symbols-outlined text-slate-400 cursor-pointer hover:text-primary transition-colors">filter_list</span>
              </div>
              
              {loading ? (
                <div className="p-8 text-center text-slate-500">Loading records...</div>
              ) : (
                <PatientTable appointments={otherAppointments} onPatientClick={handlePatientClick} />
              )}
            </div>
          </section>

        </div>

        {/* Right Column: Daily Management & Quick Controls */}
        <div className="col-span-12 xl:col-span-4 space-y-8">
          
          {/* Daily Management Panel */}
          <section className="bg-white border border-border-structural rounded-lg p-6 shadow-clinical">
            <h2 className="font-headline-sm text-headline-sm text-text-primary mb-6">Clinic Controls</h2>
            
            <form onSubmit={handleUpdateSettings} className="space-y-6">
              {/* Toggle 1 */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-sm text-slate-900">Daily Availability</p>
                  <p className="text-xs text-slate-500">Accept new walk-ins today</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={schedule.acceptWalkIns}
                    onChange={(e) => setSchedule({...schedule, acceptWalkIns: e.target.checked})}
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              
              {/* Toggle 2 */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-sm text-slate-900">Virtual Consultations</p>
                  <p className="text-xs text-slate-500">Enable remote sessions</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={schedule.virtualConsults}
                    onChange={(e) => setSchedule({...schedule, virtualConsults: e.target.checked})}
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <hr className="border-slate-100" />

              {/* Input Field */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest font-label mb-2">Standard Consultation Fee</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">₹</span>
                  <input 
                    type="number" 
                    value={schedule.consultationFee}
                    onChange={(e) => setSchedule({...schedule, consultationFee: e.target.value})}
                    className="w-full pl-8 pr-4 py-3 border border-border-structural rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all text-sm font-semibold text-slate-900" 
                  />
                </div>
              </div>

              <button type="submit" className="w-full bg-slate-900 text-white py-3 rounded-lg font-button text-xs uppercase tracking-widest hover:bg-black transition-all cursor-pointer">
                Update Settings
              </button>
            </form>
          </section>

          {/* Statistics Snippet */}
          <section className="bg-primary rounded-lg p-6 text-white relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-80 mb-1">Efficiency Score</p>
              <h3 className="text-3xl font-display-lg">94%</h3>
              <p className="text-xs mt-4 opacity-80 leading-relaxed">
                Your patient retention and response rate is 12% higher than the clinic average.
              </p>
            </div>
            <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-emerald-800 text-8xl opacity-30 select-none" style={{ fontVariationSettings: "'FILL' 1" }}>
              monitoring
            </span>
          </section>

        </div>
      </div>

      {/* Sliding Right Panel (Patient Medical History Overlay) */}
      <PatientHistoryPanel 
        isOpen={isPanelOpen} 
        onClose={() => setIsPanelOpen(false)} 
        patient={selectedPatient} 
      />
    </>
  );
}
