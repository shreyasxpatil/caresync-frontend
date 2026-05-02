import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { Save } from 'lucide-react';

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
    e.preventDefault(); setSaving(true);
    try {
      const r = await api.put('/auth/profile', form);
      updateUser(r.data.user);
      toast.success('Profile updated!');
    } catch (err) { toast.error(err.response?.data?.message||'Update failed'); }
    finally { setSaving(false); }
  };

  return (
    <div>
      <div className="page-header">
        <div><h1>My Profile</h1><p>Manage your personal and health information</p></div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'260px 1fr',gap:24}}>
        {/* Avatar card */}
        <div className="card" style={{alignSelf:'start',textAlign:'center'}}>
          <div className="user-avatar relative overflow-hidden bg-slate-200 shrink-0" style={{width:80,height:80,fontSize:28,margin:'0 auto 16px',background:'linear-gradient(135deg,var(--accent),#0891b2)'}}>
            {user?.avatar ? <img src={user.avatar} alt="" loading="lazy" className="w-full h-full object-cover relative z-10" /> : <span className="relative z-10">{user?.firstName?.[0]}{user?.lastName?.[0]}</span>}
          </div>
          <div style={{fontWeight:700,fontSize:18}}>{user?.firstName} {user?.lastName}</div>
          <div style={{fontSize:13,color:'var(--text-muted)',marginBottom:12}}>{user?.email}</div>
          <div style={{display:'flex',flexDirection:'column',gap:8}}>
            {user?.bloodGroup&&<div style={{padding:'6px 12px',background:'rgba(239,68,68,0.1)',color:'#fca5a5',borderRadius:6,fontSize:13,fontWeight:600}}>🩸 {user.bloodGroup}</div>}
            {user?.gender&&<div style={{fontSize:13,color:'var(--text-muted)'}}>Gender: {user.gender}</div>}
            {user?.phone&&<div style={{fontSize:13,color:'var(--text-muted)'}}>📞 {user.phone}</div>}
          </div>
          {user?.isGoogleUser&&<div style={{marginTop:12,padding:'6px 12px',background:'rgba(66,133,244,0.1)',borderRadius:6,fontSize:12,color:'#60a5fa'}}>Google Account</div>}
        </div>

        {/* Form */}
        <div className="card">
          <form onSubmit={handleSave} style={{display:'flex',flexDirection:'column',gap:18}}>
            <h3 style={{fontSize:15,fontWeight:700,color:'var(--text-muted)',borderBottom:'1px solid var(--border)',paddingBottom:10}}>Personal Information</h3>
            <div className="grid-2">
              <div className="form-group"><label className="form-label">First Name</label><input className="form-input" value={form.firstName} onChange={e=>setForm({...form,firstName:e.target.value})} required/></div>
              <div className="form-group"><label className="form-label">Last Name</label><input className="form-input" value={form.lastName} onChange={e=>setForm({...form,lastName:e.target.value})} required/></div>
            </div>
            <div className="grid-2">
              <div className="form-group"><label className="form-label">Phone</label><input className="form-input" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/></div>
              <div className="form-group"><label className="form-label">Gender</label><select className="form-input" value={form.gender} onChange={e=>setForm({...form,gender:e.target.value})}><option value="">Select</option><option>Male</option><option>Female</option><option>Other</option></select></div>
            </div>
            <div className="grid-2">
              <div className="form-group"><label className="form-label">Date of Birth</label><input className="form-input" type="date" value={form.dateOfBirth} onChange={e=>setForm({...form,dateOfBirth:e.target.value})}/></div>
              <div className="form-group"><label className="form-label">Blood Group</label><select className="form-input" value={form.bloodGroup} onChange={e=>setForm({...form,bloodGroup:e.target.value})}><option value="">Select</option>{BLOOD_GROUPS.map(b=><option key={b}>{b}</option>)}</select></div>
            </div>
            <div className="form-group"><label className="form-label">Address</label><textarea className="form-input" value={form.address} onChange={e=>setForm({...form,address:e.target.value})} style={{minHeight:70}} placeholder="Your full address"/></div>
            <div className="form-group"><label className="form-label">Emergency Contact</label><input className="form-input" value={form.emergencyContact} onChange={e=>setForm({...form,emergencyContact:e.target.value})} placeholder="Name & phone number"/></div>

            <h3 style={{fontSize:15,fontWeight:700,color:'var(--text-muted)',borderBottom:'1px solid var(--border)',paddingBottom:10,marginTop:4}}>Medical Information</h3>
            <div className="form-group"><label className="form-label">Known Allergies</label><input className="form-input" value={form.allergies} onChange={e=>setForm({...form,allergies:e.target.value})} placeholder="e.g. Penicillin, Sulfa drugs"/></div>
            <div className="form-group"><label className="form-label">Medical History</label><textarea className="form-input" value={form.medicalHistory} onChange={e=>setForm({...form,medicalHistory:e.target.value})} style={{minHeight:100}} placeholder="Previous conditions, surgeries, chronic illnesses..."/></div>

            <button type="submit" className="btn btn-primary" disabled={saving}><Save size={16}/>{saving?'Saving...':'Save Profile'}</button>
          </form>
        </div>
      </div>
    </div>
  );
}
