import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import { Plus, X, User, Stethoscope, Activity, FileText, Calendar, Pill, ClipboardList, Clock, Info } from 'lucide-react';

export default function DoctorPrescriptions() {
  const location = useLocation();
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [form, setForm] = useState({ patientId:'', appointmentId:'', diagnosis:'', disease:'', allergy:'', prescription:'', notes:'', followUpDate:'' });
  const [medicines, setMedicines] = useState([{ name:'', dosage:'', frequency:'', duration:'' }]);
  const [saving, setSaving] = useState(false);
  const dateInputRef = useRef(null);

  useEffect(() => {
    Promise.all([
      api.get('/doctors/me/patients'),
      api.get('/doctors/me/appointments?status=confirmed'),
    ]).then(([pr, ar]) => {
      setPatients(pr.data.patients || []);
      setAppointments(ar.data.appointments || []);
      
      // Auto-fill from navigation state
      if (location.state?.patientId) {
        setForm(prev => ({ ...prev, patientId: location.state.patientId }));
      }
    }).catch(console.error);
  }, [location.state]);

  const addMedicine = () => setMedicines([...medicines,{name:'',dosage:'',frequency:'',duration:''}]);
  const removeMedicine = (i) => setMedicines(medicines.filter((_,idx)=>idx!==i));
  const updateMedicine = (i,field,val) => setMedicines(medicines.map((m,idx)=>idx===i?{...m,[field]:val}:m));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.patientId) return toast.error('Select a patient');
    setSaving(true);
    try {
      await api.post('/doctors/me/prescriptions', { ...form, medicines });
      toast.success('Prescription issued successfully!');
      setForm({ patientId:'', appointmentId:'', diagnosis:'', disease:'', allergy:'', prescription:'', notes:'', followUpDate:'' });
      setMedicines([{name:'',dosage:'',frequency:'',duration:''}]);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to issue prescription');
    } finally { setSaving(false); }
  };

  return (
    <div className="max-w-5xl mx-auto pb-12 animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-text-main">Issue Prescription</h1>
        <p className="text-muted mt-1">Create and record a new medical prescription.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Section 1: Patient & Diagnosis */}
        <section className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
            <h2 className="text-lg font-bold text-text-main flex items-center gap-2">
              <User className="text-primary w-5 h-5" />
              Patient & Diagnosis
            </h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Patient Select */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-text-main block">Select Patient <span className="text-error-clinical">*</span></label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                  <select 
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-slate-700 appearance-none transition-all"
                    value={form.patientId} 
                    onChange={e=>setForm({...form,patientId:e.target.value})} 
                    required
                  >
                    <option value="" disabled>Choose a patient...</option>
                    {patients.map(p=><option key={p._id} value={p._id}>{p.firstName} {p.lastName}</option>)}
                  </select>
                </div>
              </div>

              {/* Linked Appointment */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-text-main block">Linked Appointment</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                  <select 
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-slate-700 appearance-none transition-all"
                    value={form.appointmentId} 
                    onChange={e=>setForm({...form,appointmentId:e.target.value})}
                  >
                    <option value="">None (Walk-in / Direct)</option>
                    {appointments.map(a=><option key={a._id} value={a._id}>{a.patient?.firstName} {a.patient?.lastName} — {new Date(a.appointmentDate).toLocaleDateString()}</option>)}
                  </select>
                </div>
              </div>

              {/* Primary Diagnosis */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-text-main block">Primary Diagnosis <span className="text-error-clinical">*</span></label>
                <div className="relative">
                  <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                  <input 
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-slate-700 transition-all"
                    value={form.diagnosis} 
                    onChange={e=>setForm({...form,diagnosis:e.target.value})} 
                    placeholder="e.g., Acute Bronchitis" 
                    required
                  />
                </div>
              </div>

              {/* Disease/Condition */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-text-main block">Underlying Condition</label>
                <div className="relative">
                  <Activity className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                  <input 
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-slate-700 transition-all"
                    value={form.disease} 
                    onChange={e=>setForm({...form,disease:e.target.value})} 
                    placeholder="e.g., Asthma"
                  />
                </div>
              </div>

              {/* Allergies */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-text-main block">Known Allergies</label>
                <div className="relative">
                  <Info className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500 w-5 h-5 pointer-events-none" />
                  <input 
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-slate-700 transition-all"
                    value={form.allergy} 
                    onChange={e=>setForm({...form,allergy:e.target.value})} 
                    placeholder="e.g., Penicillin, Peanuts (Leave blank if none)"
                  />
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Section 2: Medication Plan */}
        <section className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex justify-between items-center">
            <h2 className="text-lg font-bold text-text-main flex items-center gap-2">
              <Pill className="text-primary w-5 h-5" />
              Medication Plan
            </h2>
            <button 
              type="button" 
              onClick={addMedicine}
              className="text-sm font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300 px-4 py-1.5 rounded-md flex items-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Medicine
            </button>
          </div>
          
          <div className="p-6 space-y-4">
            {medicines.map((m, i) => (
              <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-background p-4 rounded-md border border-slate-200 relative group">
                <div className="md:col-span-4 space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Medicine Name</label>
                  <input 
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-sm"
                    placeholder="e.g., Amoxicillin 500mg" 
                    value={m.name} 
                    onChange={e=>updateMedicine(i,'name',e.target.value)}
                  />
                </div>
                <div className="md:col-span-3 space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Dosage</label>
                  <input 
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-sm"
                    placeholder="e.g., 1 Tablet" 
                    value={m.dosage} 
                    onChange={e=>updateMedicine(i,'dosage',e.target.value)}
                  />
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Frequency</label>
                  <input 
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-sm"
                    placeholder="e.g., 1-0-1" 
                    value={m.frequency} 
                    onChange={e=>updateMedicine(i,'frequency',e.target.value)}
                  />
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Duration</label>
                  <input 
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-sm"
                    placeholder="e.g., 5 Days" 
                    value={m.duration} 
                    onChange={e=>updateMedicine(i,'duration',e.target.value)}
                  />
                </div>
                
                {medicines.length > 1 && (
                  <div className="md:col-span-1 flex justify-end md:justify-center pt-5">
                    <button 
                      type="button" 
                      onClick={() => removeMedicine(i)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      title="Remove Medicine"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Additional Details & Notes */}
        <section className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
            <h2 className="text-lg font-bold text-text-main flex items-center gap-2">
              <ClipboardList className="text-primary w-5 h-5" />
              Prescription Details & Notes
            </h2>
          </div>
          <div className="p-6 space-y-6">
            
            {/* Detailed Instructions */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-text-main block">Detailed Instructions <span className="text-error-clinical">*</span></label>
              <div className="relative">
                <FileText className="absolute left-3 top-4 text-slate-400 w-5 h-5 pointer-events-none" />
                <textarea 
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-slate-700 min-h-[120px] transition-all"
                  value={form.prescription} 
                  onChange={e=>setForm({...form,prescription:e.target.value})} 
                  placeholder="Write the full prescription narrative, dietary advice, or specific usage instructions here..." 
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Additional Notes */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-text-main block">Internal/Additional Notes</label>
                <textarea 
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-slate-700 min-h-[100px] transition-all"
                  value={form.notes} 
                  onChange={e=>setForm({...form,notes:e.target.value})} 
                  placeholder="Private clinical notes, lifestyle restrictions..." 
                />
              </div>

              {/* Follow-up Date */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-text-main block">Follow-up Date</label>
                <div 
                  className="relative block cursor-pointer group"
                  onClick={() => dateInputRef.current?.showPicker()}
                >
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none z-10" />
                  <input 
                    type="date" 
                    ref={dateInputRef}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-slate-700 transition-all cursor-pointer relative z-0"
                    value={form.followUpDate} 
                    onChange={e=>setForm({...form,followUpDate:e.target.value})} 
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Submit Action */}
        <div className="flex justify-end pt-4">
          <button 
            type="submit" 
            disabled={saving}
            className="bg-primary hover:bg-emerald-800 text-white font-bold px-8 py-3.5 rounded-md shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>Saving Prescription...</>
            ) : (
              <>
                <FileText className="w-5 h-5" />
                Issue Prescription
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
