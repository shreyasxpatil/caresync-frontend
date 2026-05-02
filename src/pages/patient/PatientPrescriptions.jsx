import { useEffect, useState } from 'react';
import api from '../../api/axios';

export default function PatientPrescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    api.get('/patients/prescriptions').then(r => setPrescriptions(r.data.prescriptions));
  }, []);

  return (
    <div>
      <table className="table table-hover">
        <thead>
          <tr>
            <th scope="col">Doctor Name</th>
            <th scope="col">Appointment ID</th>
            <th scope="col">Appointment Date</th>
            <th scope="col">Appointment Time</th>
            <th scope="col">Diseases</th>
            <th scope="col">Allergies</th>
            <th scope="col">Prescriptions</th>
            <th scope="col">Bill Payment</th>
          </tr>
        </thead>
        <tbody>
          {prescriptions.map(row => (
            <tr key={row._id}>
              <td>{row.doctor?.firstName} {row.doctor?.lastName}</td>
              <td>{row.appointment?._id?.substring(0,8) || 'N/A'}</td>
              <td>{row.createdAt ? new Date(row.createdAt).toISOString().split('T')[0] : ''}</td>
              <td>{'--'}</td>
              <td>{row.disease}</td>
              <td>{row.allergy}</td>
              <td>{row.prescription}</td>
              <td>
                <button className="btn btn-success" onClick={() => alert('Bill Paid Successfully')}>Pay Bill</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <br />
    </div>
  );
}
