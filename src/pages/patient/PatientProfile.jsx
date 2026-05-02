import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { Save, User, MapPin, Phone, HeartPulse, Edit3 } from 'lucide-react';
import { motion } from 'framer-motion';

const BLOOD_GROUPS = ['A+','A-','B+','B-','AB+','AB-','O+','O-'];

export default function PatientProfile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    firstName: user?.firstName||'', lastName: user?.lastName||'', phone: user?.phone||'',
    gender: user?.gender||'', dateOfBirth: user?.dateOfBirth?.split('T')[0]||'',
    address: user?.address||'', bloodGroup: user?.bloodGroup||'',
    allergies: user?.allergies||'', medicalHistory: user?.medicalHistory||'',
    emergencyContact: user?.emergencyContact||'',
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault(); 
    setSaving(true);
    try {
      const r = await api.put('/auth/profile', form);
      updateUser(r.data.user);
      toast.success('Profile updated successfully!');
    } catch (err) { 
      toast.error(err.response?.data?.message||'Update failed'); 
    } finally { 
      setSaving(false); 
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-[1200px] mx-auto space-y-8"
    >
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Left Column: Identity Card */}
        <div className="w-full md:w-80 bg-white rounded-[2rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/40 flex flex-col items-center text-center relative overflow-hidden group">
          {/* Background decoration */}
          <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-br from-emerald-500 to-teal-600"></div>
          
          <div className="relative mt-8 mb-6">
            <div className="size-32 rounded-full overflow-hidden bg-white p-1 shadow-lg border-4 border-white">
              {user?.avatar ? (
                <img src={user.avatar} alt="Profile" className="w-full h-full object-cover rounded-full" />
              ) : (
                <div className="w-full h-full bg-slate-100 flex items-center justify-center text-3xl font-black text-slate-400 uppercase rounded-full">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </div>
              )}
            </div>
            <button className="absolute bottom-0 right-0 size-10 bg-emerald-600 rounded-full flex items-center justify-center text-white border-4 border-white hover:bg-emerald-700 transition shadow-sm cursor-pointer">
              <Edit3 size={16} />
            </button>
          </div>

          <h2 className="text-2xl font-black text-slate-900 tracking-tight">{user?.firstName} {user?.lastName}</h2>
          <p className="text-slate-500 font-medium text-sm mt-1">{user?.email}</p>
          
          {user?.isGoogleUser && (
             <div className="mt-4 px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-blue-100">
               Google Account linked
             </div>
          )}

          <div className="w-full mt-8 space-y-4 text-left">
            {user?.bloodGroup && (
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-700">
                <div className="size-10 bg-white rounded-xl flex items-center justify-center shadow-sm">🩸</div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Blood Group</p>
                  <p className="font-bold">{user.bloodGroup}</p>
                </div>
              </div>
            )}
            {user?.phone && (
              <div className="flex items-center gap-4 px-2">
                <Phone className="size-5 text-emerald-500" />
                <span className="text-sm font-bold text-slate-700">{user.phone}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Edit Form */}
        <div className="flex-1 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 p-8 md:p-10">
          <form onSubmit={handleSave} className="space-y-8">
            
            {/* Section 1: Personal Info */}
            <div>
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                <div className="size-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <User size={20} />
                </div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Personal Details</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">First Name</label>
                  <input type="text" required value={form.firstName} onChange={e=>setForm({...form,firstName:e.target.value})} className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all font-semibold" />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">Last Name</label>
                  <input type="text" required value={form.lastName} onChange={e=>setForm({...form,lastName:e.target.value})} className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all font-semibold" />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">Phone</label>
                  <input type="tel" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all font-semibold" />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">Gender</label>
                  <select value={form.gender} onChange={e=>setForm({...form,gender:e.target.value})} className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all font-semibold">
                    <option value="">Select Gender</option>
                    <option>Male</option><option>Female</option><option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">Date of Birth</label>
                  <input type="date" value={form.dateOfBirth} onChange={e=>setForm({...form,dateOfBirth:e.target.value})} className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all font-semibold" />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">Blood Group</label>
                  <select value={form.bloodGroup} onChange={e=>setForm({...form,bloodGroup:e.target.value})} className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all font-semibold">
                    <option value="">Select Group</option>
                    {BLOOD_GROUPS.map(b=><option key={b}>{b}</option>)}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2"><MapPin size={14}/> Address</label>
                  <textarea value={form.address} onChange={e=>setForm({...form,address:e.target.value})} placeholder="Full residential address" className="w-full min-h-[100px] bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all font-semibold resize-y" />
                </div>
              </div>
            </div>

            {/* Section 2: Medical Info */}
            <div>
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                <div className="size-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <HeartPulse size={20} />
                </div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Health Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="md:col-span-2">
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">Emergency Contact</label>
                  <input type="text" value={form.emergencyContact} onChange={e=>setForm({...form,emergencyContact:e.target.value})} placeholder="Name and Phone Number" className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all font-semibold" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">Known Allergies</label>
                  <input type="text" value={form.allergies} onChange={e=>setForm({...form,allergies:e.target.value})} placeholder="e.g. Penicillin, Peanuts..." className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all font-semibold" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">Medical History</label>
                  <textarea value={form.medicalHistory} onChange={e=>setForm({...form,medicalHistory:e.target.value})} placeholder="Previous surgeries, chronic conditions, etc." className="w-full min-h-[120px] bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all font-semibold resize-y" />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex justify-end">
              <button 
                type="submit" 
                disabled={saving}
                className="flex items-center gap-2 bg-emerald-600 text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest text-[12px] hover:bg-slate-900 active:scale-95 transition-all shadow-xl shadow-emerald-200 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <Save size={16} />
                {saving ? 'Synchronizing...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
