import { useEffect, useState, useRef, useMemo } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import { Stethoscope, Search, User, Calendar, Clock, CreditCard, CheckCircle2 } from 'lucide-react';

export default function PatientBookAppointment() {
  const [specs, setSpecs] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({ spec: '', doctorId: '', appdate: '', apptime: '' });
  const [docFees, setDocFees] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { onBookingSuccess } = useOutletContext() || { onBookingSuccess: () => {} };
  
  const dateInputRef = useRef(null);

  const TIME_SLOTS = [
    "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM",
    "12:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"
  ];

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    Promise.all([api.get('/doctors/specializations'), api.get('/doctors')]).then(([sr, dr]) => {
      setSpecs(sr.data.specializations || []);
      setDoctors(dr.data.doctors || []);
    });
  }, []);

  const handleSpecChange = (e) => {
    setForm({ ...form, spec: e.target.value, doctorId: '', apptime: '' });
    setSearchTerm('');
    setDocFees('');
  };

  const handleDoctorChange = (e) => {
    const docId = e.target.value;
    setForm({ ...form, doctorId: docId, apptime: '' });
    const selectedDoc = doctors.find(d => d._id === docId);
    if (selectedDoc) {
      setDocFees(selectedDoc.consultationFee || 500);
      setForm(prev => ({ ...prev, spec: selectedDoc.specialization })); // Sync spec
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.apptime) {
      return toast.error('Please select an appointment time.');
    }
    setLoading(true);
    try {
      await api.post('/patients/appointments', {
        doctorId: form.doctorId,
        appointmentDate: form.appdate,
        appointmentTime: form.apptime,
        reason: 'General Consultation'
      });
      onBookingSuccess();
      toast.success('Your appointment successfully booked!');
      navigate('/patient'); 
    } catch (err) {
      toast.error('Unable to process your request. Please try again!');
    } finally {
      setLoading(false);
    }
  };

  // Logic: Show top 3 recent by default, or filter by search/spec
  const displayedDoctors = useMemo(() => {
    let filtered = [...doctors];
    
    if (searchTerm) {
      filtered = filtered.filter(d => 
        `${d.firstName} ${d.lastName} ${d.specialization}`.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else if (form.spec) {
      filtered = filtered.filter(d => d.specialization === form.spec);
    } else {
      // Default state: 3 most recent
      return [...doctors]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 3);
    }
    return filtered;
  }, [doctors, searchTerm, form.spec]);

  return (
    <div className="max-w-4xl mx-auto pb-8 animate-in fade-in duration-500">
      
      <div className="mb-8 text-center">
        <h1 className="font-heading text-4xl font-black text-slate-900 tracking-tight">Book a Consultation</h1>
        <p className="text-slate-500 font-medium mt-2">Connect with our top-rated medical specialists</p>
      </div>

      <div className="bg-white rounded-[2rem] shadow-2xl shadow-emerald-900/5 border border-slate-100 overflow-hidden">
        <div className="h-2 w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600"></div>

        <div className="p-8 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-10">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Specialization Selection */}
              <div className="space-y-2.5">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Clinical Department</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 size-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-focus-within:bg-emerald-600 group-focus-within:text-white transition-all duration-300">
                    <Stethoscope className="size-5" />
                  </div>
                  <select 
                    className="w-full pl-16 pr-10 py-4 bg-slate-50/50 border border-slate-100 rounded-[1.25rem] focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 text-[15px] font-bold text-slate-700 appearance-none transition-all cursor-pointer shadow-sm hover:bg-white"
                    value={form.spec} 
                    onChange={handleSpecChange}
                  >
                    <option value="">All Departments</option>
                    {specs.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

              {/* Search by Name */}
              <div className="space-y-2.5">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Search Specialist</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 size-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-focus-within:bg-emerald-600 group-focus-within:text-white transition-all duration-300">
                    <Search className="size-5" />
                  </div>
                  <input 
                    type="text"
                    placeholder="Type name or specialty..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      if (e.target.value) setForm(f => ({ ...f, spec: '' })); // Clear spec if searching
                    }}
                    className="w-full pl-16 pr-4 py-4 bg-slate-50/50 border border-slate-100 rounded-[1.25rem] focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 text-[15px] font-bold text-slate-700 transition-all shadow-sm hover:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Doctor Selection */}
            <div className="space-y-3">
              <div className="flex items-center justify-between ml-1">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Available Doctors</label>
                {!searchTerm && !form.spec && (
                  <span className="text-[9px] font-black bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full uppercase tracking-tighter">Recently Joined</span>
                )}
              </div>
              
              <div className="grid grid-cols-1 gap-3 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
                {displayedDoctors.map(d => (
                  <div 
                    key={d._id}
                    onClick={() => handleDoctorChange({ target: { value: d._id } })}
                    className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                      form.doctorId === d._id 
                        ? 'bg-emerald-50 border-emerald-200 ring-2 ring-emerald-500/5' 
                        : 'bg-white border-slate-100 hover:border-emerald-100 hover:shadow-lg hover:shadow-emerald-900/5'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="size-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center text-white font-black text-lg">
                        {d.firstName?.[0]}
                      </div>
                      <div>
                        <div className="text-[15px] font-black text-slate-900 tracking-tight">Dr. {d.firstName} {d.lastName}</div>
                        <div className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest">{d.specialization}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[14px] font-black text-slate-900 italic">₹{d.consultationFee || 500}</div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Consult Fee</div>
                    </div>
                  </div>
                ))}
                {displayedDoctors.length === 0 && (
                  <div className="text-center py-10 text-slate-400 font-bold uppercase tracking-widest text-xs">No doctors matched your criteria</div>
                )}
              </div>
            </div>

            {/* Date Selection */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-text-main block">Appointment Date</label>
              <div 
                className="relative block cursor-pointer group"
                onClick={() => dateInputRef.current?.showPicker()}
              >
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 w-5 h-5 pointer-events-none group-focus-within:text-emerald-700 transition-colors z-10" />
                <input 
                  type="date" 
                  ref={dateInputRef}
                  className="w-full pl-12 pr-4 py-3.5 bg-background border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-slate-700 transition-all cursor-pointer font-medium relative z-0"
                  required 
                  value={form.appdate} 
                  onChange={e => setForm({ ...form, appdate: e.target.value })} 
                  min={new Date().toISOString().split('T')[0]} 
                />
              </div>
            </div>

            {/* Time Slot Grid */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-text-main flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" />
                Available Time Slots
              </label>
              
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {TIME_SLOTS.map((time) => {
                  const isSelected = form.apptime === time;
                  return (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setForm({...form, apptime: time})}
                      className={`py-3 rounded-xl text-sm font-bold tracking-wide transition-all duration-200 cursor-pointer ${
                        isSelected 
                          ? 'bg-emerald-600 text-white shadow-md transform scale-[1.02] ring-2 ring-emerald-600 ring-offset-2' 
                          : 'bg-background text-slate-600 border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50'
                      }`}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
              {!form.apptime && <p className="text-xs text-slate-500 mt-2 italic">* Select a preferred time to continue.</p>}
            </div>

            <hr className="border-slate-100" />

            {/* Consultancy Fees (Read-Only) */}
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-500">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-text-main">Consultation Fee</p>
                  <p className="text-xs text-slate-500">To be paid at the clinic</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-emerald-700">
                  {docFees ? `₹${docFees}` : '--'}
                </p>
              </div>
            </div>

            {/* Submit Action */}
            <button 
              type="submit" 
              disabled={loading || !form.doctorId || !form.appdate || !form.apptime}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
            >
              {loading ? (
                <span>Processing Booking...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-6 h-6" />
                  Confirm Appointment
                </>
              )}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}
