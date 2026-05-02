import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import { Save, User } from 'lucide-react';

const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
const SPECS = ['Cardiologist','Dermatologist','Neurologist','Orthopedic','Pediatrician','General Physician','ENT Specialist','Ophthalmologist','Psychiatrist','Gynecologist'];

export default function DoctorProfile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    firstName: user?.firstName||'', lastName: user?.lastName||'', phone: user?.phone||'',
    gender: user?.gender||'', specialization: user?.specialization||'', qualifications: user?.qualifications||'',
    experience: user?.experience||'', consultationFee: user?.consultationFee||'',
    availableDays: user?.availableDays||[], availableTimeStart: user?.availableTimeStart||'09:00',
    availableTimeEnd: user?.availableTimeEnd||'17:00', address: user?.address||'',
  });
  const [saving, setSaving] = useState(false);

  const toggleDay = (day) => setForm(f=>({...f, availableDays: f.availableDays.includes(day)?f.availableDays.filter(d=>d!==day):[...f.availableDays,day]}));

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      const r = await api.put('/auth/profile', form);
      updateUser(r.data.user);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally { setSaving(false); }
  };

  return (
    <div>
      <div className="page-header">
        <div><h1>My Profile</h1><p>Update your professional details</p></div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'280px 1fr',gap:24}}>
        {/* Avatar card */}
        <div className="card" style={{alignSelf:'start',textAlign:'center'}}>
          <div className="user-avatar" style={{width:80,height:80,fontSize:28,margin:'0 auto 16px',background:'linear-gradient(135deg,var(--primary),var(--secondary))'}}>
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <div style={{fontWeight:700,fontSize:18}}>Dr. {user?.firstName} {user?.lastName}</div>
          <div style={{color:'var(--primary)',fontWeight:500,marginBottom:8}}>{user?.specialization}</div>
          <div style={{fontSize:13,color:'var(--text-muted)'}}>{user?.email}</div>
          <div style={{marginTop:16,padding:'8px 16px',background:'rgba(14,165,233,0.1)',borderRadius:8,fontSize:13,color:'var(--primary)'}}>
            {user?.experience ? `${user.experience} years experience` : 'Update your experience'}
          </div>
        </div>

        {/* Form */}
        <div className="card">
          <form onSubmit={handleSave} style={{display:'flex',flexDirection:'column',gap:18}}>
            <div className="grid-2">
              <div className="form-group"><label className="form-label">First Name</label><input className="form-input" value={form.firstName} onChange={e=>setForm({...form,firstName:e.target.value})} required/></div>
              <div className="form-group"><label className="form-label">Last Name</label><input className="form-input" value={form.lastName} onChange={e=>setForm({...form,lastName:e.target.value})} required/></div>
            </div>
            <div className="grid-2">
              <div className="form-group"><label className="form-label">Phone</label><input className="form-input" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/></div>
              <div className="form-group"><label className="form-label">Gender</label><select className="form-input" value={form.gender} onChange={e=>setForm({...form,gender:e.target.value})}><option value="">Select</option><option>Male</option><option>Female</option><option>Other</option></select></div>
            </div>
            <div className="grid-2">
              <div className="form-group"><label className="form-label">Specialization</label><select className="form-input" value={form.specialization} onChange={e=>setForm({...form,specialization:e.target.value})}><option value="">Select</option>{SPECS.map(s=><option key={s}>{s}</option>)}</select></div>
              <div className="form-group"><label className="form-label">Qualifications</label><input className="form-input" value={form.qualifications} onChange={e=>setForm({...form,qualifications:e.target.value})} placeholder="MBBS, MD"/></div>
            </div>
            <div className="grid-2">
              <div className="form-group"><label className="form-label">Experience (years)</label><input className="form-input" type="number" value={form.experience} onChange={e=>setForm({...form,experience:e.target.value})}/></div>
              <div className="form-group"><label className="form-label">Consultation Fee (₹)</label><input className="form-input" type="number" value={form.consultationFee} onChange={e=>setForm({...form,consultationFee:e.target.value})}/></div>
            </div>
            <div className="form-group">
              <label className="form-label">Available Days</label>
              <div style={{display:'flex',flexWrap:'wrap',gap:8,marginTop:4}}>
                {DAYS.map(day=>(
                  <button type="button" key={day} onClick={()=>toggleDay(day)}
                    style={{padding:'4px 14px',borderRadius:999,fontSize:12,fontWeight:600,cursor:'pointer',border:'1px solid',borderColor:form.availableDays.includes(day)?'var(--primary)':'var(--border)',background:form.availableDays.includes(day)?'rgba(14,165,233,0.15)':'transparent',color:form.availableDays.includes(day)?'var(--primary)':'var(--text-muted)'}}>
                    {day}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid-2">
              <div className="form-group"><label className="form-label">Start Time</label><input className="form-input" type="time" value={form.availableTimeStart} onChange={e=>setForm({...form,availableTimeStart:e.target.value})}/></div>
              <div className="form-group"><label className="form-label">End Time</label><input className="form-input" type="time" value={form.availableTimeEnd} onChange={e=>setForm({...form,availableTimeEnd:e.target.value})}/></div>
            </div>
            <button type="submit" className="btn btn-primary" disabled={saving}><Save size={16}/>{saving?'Saving...':'Save Changes'}</button>
          </form>
        </div>
      </div>
    </div>
  );
}
