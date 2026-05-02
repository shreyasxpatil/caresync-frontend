import { Outlet } from 'react-router-dom';
import DoctorNavbar from '../../components/doctor/DoctorNavbar';
import DoctorSidebar from '../../components/doctor/DoctorSidebar';

export default function DoctorLayout() {
  return (
    <div className="bg-background text-on-surface min-h-screen font-body-base">
      <DoctorNavbar />
      <DoctorSidebar />
      
      {/* Main Content Canvas */}
      <main className="md:ml-64 pt-24 px-8 pb-16 max-w-[1400px]">
        <Outlet />
      </main>
    </div>
  );
}
