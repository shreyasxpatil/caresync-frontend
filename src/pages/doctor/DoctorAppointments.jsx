import { useEffect, useState } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { Search, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import GlobalLoader from '../../components/GlobalLoader';

const STATUS_BADGE = { pending:'badge-pending', confirmed:'badge-confirmed', completed:'badge-completed', cancelled:'badge-cancelled' };

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const q = statusFilter !== 'all' ? `?status=${statusFilter}` : '';
      const r = await api.get(`/doctors/me/appointments${q}`);
      setAppointments(r.data.appointments);
    } catch { toast.error('Failed to load appointments'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAppointments(); }, [statusFilter]);

  const handleUpdate = async (id, status) => {
    try {
      await api.put(`/doctors/me/appointments/${id}`, { status });
      toast.success('Appointment updated');
      fetchAppointments();
    } catch { toast.error('Update failed'); }
  };

  const filtered = appointments.filter(a =>
    `${a.patient?.firstName} ${a.patient?.lastName}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="page-header">
        <div><h1>My Appointments</h1><p>{appointments.length} total appointments</p></div>
      </div>

      <div className="search-bar">
        <div className="search-input-wrap" style={{flex:1}}>
          <Search size={16}/>
          <input className="form-input" placeholder="Search patient..." value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
        <div style={{display:'flex',gap:8}}>
          {['all','pending','confirmed','completed','cancelled'].map(s=>(
            <button key={s} className={`btn btn-sm ${statusFilter===s?'btn-primary':'btn-secondary'}`}
              onClick={()=>setStatusFilter(s)} style={{textTransform:'capitalize'}}>{s}</button>
          ))}
        </div>
      </div>

      <div className="table-wrapper">
        <table>
          <thead><tr><th>Patient</th><th>Date</th><th>Time</th><th>Reason</th><th>Symptoms</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {loading
              ? <tr><td colSpan={7}><GlobalLoader text="Syncing Appointments..." /></td></tr>
              : filtered.length
                ? filtered.map(a=>(
                  <tr key={a._id}>
                    <td>
                      <div style={{display:'flex',alignItems:'center',gap:10}}>
                        <div className="user-avatar" style={{width:34,height:34,fontSize:12,background:'linear-gradient(135deg,var(--accent),#0891b2)'}}>{a.patient?.firstName?.[0]}{a.patient?.lastName?.[0]}</div>
                        <div>
                          <div style={{fontWeight:600,color:'var(--text-primary)',fontSize:14}}>{a.patient?.firstName} {a.patient?.lastName}</div>
                          <div style={{fontSize:11,color:'var(--text-muted)'}}>{a.patient?.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td>{a.appointmentDate ? format(new Date(a.appointmentDate),'dd MMM yyyy') : '—'}</td>
                    <td>{a.appointmentTime}</td>
                    <td style={{maxWidth:140,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',fontSize:13,color:'var(--text-muted)'}}>{a.reason}</td>
                    <td style={{maxWidth:120,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',fontSize:13,color:'var(--text-muted)'}}>{a.symptoms||'—'}</td>
                    <td><span className={`badge ${STATUS_BADGE[a.status]}`}>{a.status}</span></td>
                    <td>
                      <div style={{display:'flex',gap:6}}>
                        {a.status==='pending'&&(
                          <>
                            <button className="btn btn-success btn-sm" onClick={()=>handleUpdate(a._id,'confirmed')}><CheckCircle size={13}/></button>
                            <button className="btn btn-danger btn-sm" onClick={()=>handleUpdate(a._id,'cancelled')}><XCircle size={13}/></button>
                          </>
                        )}
                        {a.status==='confirmed'&&(
                          <button className="btn btn-primary btn-sm" onClick={()=>handleUpdate(a._id,'completed')}>Complete</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
                : <tr><td colSpan={7} style={{textAlign:'center',padding:32,color:'var(--text-muted)'}}>No appointments found</td></tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}
