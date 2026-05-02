import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const GoogleCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { handleGoogleCallback } = useAuth();

  useEffect(() => {
    const processCallback = async () => {
      const token = searchParams.get("token");
      const role = searchParams.get("role");
      const error = searchParams.get("error");

      if (error) {
        toast.error("Google authentication failed");
        return navigate("/");
      }

      if (token) {
        try {
          const user = await handleGoogleCallback(token);
          toast.success(`Welcome back, ${user.firstName}!`);
          navigate(`/${user.role}`);
        } catch (err) {
          toast.error("Failed to load user profile");
          navigate("/");
        }
      } else {
        navigate("/");
      }
    };
    processCallback();
  }, [searchParams, navigate, handleGoogleCallback]);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-white">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mb-4"></div>
      <p className="text-slate-600 font-heading font-medium">Completing secure sign-in...</p>
    </div>
  );
};
export default GoogleCallback;
