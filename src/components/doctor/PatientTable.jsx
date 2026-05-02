import { format } from 'date-fns';

export default function PatientTable({ appointments, onPatientClick }) {
  if (!appointments || appointments.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500 italic border-t border-border-structural">
        No recent encounters found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-slate-50 text-[11px] uppercase tracking-widest font-label text-slate-500 border-b border-border-structural">
            <th className="px-6 py-4">Patient Name</th>
            <th className="px-6 py-4">Date</th>
            <th className="px-6 py-4">Type</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-structural">
          {appointments.map((app) => (
            <tr 
              key={app._id} 
              onClick={() => onPatientClick(app.patient)}
              className="hover:bg-emerald-50/50 transition-all cursor-pointer group"
            >
              <td className="px-6 py-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200 shrink-0 ring-2 ring-offset-2 ring-emerald-500">
                  <img 
                    src={app.patient?.avatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=75&fm=webp"} 
                    alt="Patient" 
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                  />
                </div>
                <div>
                  <p className="font-semibold text-sm text-slate-900 flex items-center gap-2">
                    {app.patient?.firstName} {app.patient?.lastName}
                    <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[9px] uppercase tracking-widest font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Vitals Stable
                    </span>
                  </p>
                  <p className="text-xs text-slate-500">ID: #{app.patient?._id?.slice(-6).toUpperCase() || 'UNKNOWN'}</p>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-slate-600">
                {app.appointmentDate ? format(new Date(app.appointmentDate), 'MMM dd, yyyy') : 'N/A'}
              </td>
              <td className="px-6 py-4 text-sm text-slate-600">
                {app.reason || 'Consultation'}
              </td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded-sm ${
                  app.status === 'confirmed' ? 'bg-amber-100 text-amber-800' :
                  app.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                  app.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                  'bg-slate-100 text-slate-800'
                }`}>
                  {app.status}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 group-hover:text-emerald-600 transition-colors opacity-0 group-hover:opacity-100">
                    View File
                  </span>
                  <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">
                    chevron_right
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
