import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
const PrivateRoute = ({ children, role }) => {
  const { user, loading } = useAuth();
  if(loading) return <div className="h-screen flex items-center justify-center font-heading text-emerald-600 font-bold">Verifying Session...</div>;
  if(!user) return <Navigate to="/" replace />;
  if(role && user.role !== role) return <Navigate to={`/${user.role}`} replace />;
  return children;
};
export default PrivateRoute;
