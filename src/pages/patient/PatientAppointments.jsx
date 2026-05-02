import { useEffect, useState } from 'react';
import api from '../../api/axios';

export default function PatientAppointments() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    api.get('/patients/appointments').then(r => setAppointments(r.data.appointments));
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment ?')) return;
    try {
      await api.put(`/patients/appointments/${id}/cancel`, { cancelReason: 'Cancelled by You' });
      alert('Your appointment successfully cancelled');
      api.get('/patients/appointments').then(r => setAppointments(r.data.appointments));
    } catch (err) { alert('Failed to cancel'); }
  };

  return (
    <div>
      <table className="table table-hover">
        <thead>
          <tr>
            <th scope="col">Doctor Name</th>
            <th scope="col">Consultancy Fees</th>
            <th scope="col">Appointment Date</th>
            <th scope="col">Appointment Time</th>
            <th scope="col">Current Status</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map(row => {
            const isCancellable = ['pending', 'confirmed'].includes(row.status);
            
            let statusText = '';
            if (['pending', 'confirmed', 'completed'].includes(row.status)) { statusText = 'Active'; }
            if (row.status === 'cancelled') { statusText = 'Cancelled'; }

            return (
              <tr key={row._id}>
                <td>{row.doctor?.firstName} {row.doctor?.lastName}</td>
                <td>{row.doctor?.consultationFee || 500}</td>
                <td>{row.appointmentDate ? new Date(row.appointmentDate).toISOString().split('T')[0] : ''}</td>
                <td>{row.appointmentTime}</td>
                <td>{statusText}</td>
                <td>
                  {isCancellable ? (
                    <button className="btn btn-danger" onClick={() => handleCancel(row._id)}>Cancel</button>
                  ) : (
                    "Cancelled"
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <br />
    </div>
  );
}
