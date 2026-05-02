import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import ServicesSection from '../../components/home/ServicesSection';
import WhyUsSection from '../../components/home/WhyUsSection';
import ContactAndFooter from '../../components/home/ContactAndFooter';
const API_BASE = import.meta.env.VITE_API_URL || 'https://caresync-backend-ufha.onrender.com/api';
const GOOGLE_AUTH_URL = `${API_BASE.replace('/api', '')}/api/auth/google`;

export default function IndexPage() {
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [form, setForm] = useState({ role: 'patient', fullName: '', email: '', phone: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  const { register, login, user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setIsMounted(true);
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % 5);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isLoginMode) {
        const loggedUser = await login(form.email, form.password);
        if(loggedUser.role !== form.role) throw new Error(`Not an ${form.role} account`);
        toast.success('Login successful!');
        navigate(`/${loggedUser.role}`);
      } else {
        const [firstName, ...lastNameArr] = form.fullName.split(' ');
        const lastName = lastNameArr.join(' ');
        await register({ 
          firstName: firstName || '', 
          lastName: lastName || '', 
          email: form.email, 
          password: form.password, 
          phone: form.phone, 
          role: form.role,
          gender: 'Male'
        });
        toast.success('Registration successful!');
        navigate(`/${form.role}`);
      }
    } catch(err) {
      toast.error(err.response?.data?.message || err.message || 'Authentication failed');
    } finally { 
      setLoading(false); 
    }
  };

  const certificates = [
    {icon: 'verified_user', text: 'JCI Accredited'},
    {icon: 'military_tech', text: 'Clinical Excellence 2023'},
    {icon: 'workspace_premium', text: 'Top Tier Medical Staff'},
    {icon: 'award_star', text: 'Patient Choice Award'},
    {icon: 'health_and_safety', text: 'HIPAA Gold Certified'},
    {icon: 'star', text: 'Top 100 Clinics'},
    {icon: 'verified', text: 'ISO Certified'},
    {icon: 'medical_services', text: 'Quality Care Gold'},
    {icon: 'thumb_up', text: '99% Patient Satisfaction'}
  ];

  return (
    <div className="bg-white min-h-screen font-body">
      
      {/* Phase 1: Perfect Navbar Centering (3-Column Grid) */}
      <header className="w-full h-20 px-8 flex justify-between items-center bg-white border-b border-slate-200 fixed top-0 z-50">
        {/* Left Side: Logo */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-3 no-underline">
            <div className="size-8 text-emerald-600">
              <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                <path d="M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08v0c.85.85 2.23.85 3.08 0L15 8"></path>
              </svg>
            </div>
            <span className="font-heading font-black text-2xl text-emerald-800 tracking-tight uppercase">CareSync</span>
          </Link>
        </div>

        {/* Right Side: Links and Login Group */}
        <div className="flex items-center">
          <nav className="flex items-center gap-8 mr-[11vw]">
            <Link className="text-emerald-700 font-heading font-bold no-underline" to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Home</Link>
            <a className="text-slate-500 font-body font-medium hover:text-emerald-600 transition-all duration-200 no-underline" href="#services">Services</a>
            <a className="text-slate-500 font-body font-medium hover:text-emerald-600 transition-all duration-200 no-underline" href="#why-us">Why Us</a>
            <a className="text-slate-500 font-body font-medium hover:text-emerald-600 transition-all duration-200 no-underline" href="#contact">Contact Us</a>
          </nav>

          {user ? (
            <Link to={`/${user.role}`} className="no-underline">
              <button className="bg-emerald-600 text-white font-bold uppercase tracking-wide text-[13px] px-8 py-3 rounded-xl shadow-md hover:bg-emerald-700 transition-all">Dashboard</button>
            </Link>
          ) : (
            <button 
              onClick={() => setIsLoginMode(true)} 
              className="bg-emerald-600 text-white font-bold uppercase tracking-wide text-[13px] px-10 py-3 rounded-xl shadow-md hover:bg-emerald-700 transition-all cursor-pointer"
            >
              Login
            </button>
          )}
        </div>
      </header>

      {/* Phase 2: Restoring the Missing Hero Images (Left Side) */}
      <main className="flex w-full h-[69vh] mt-20 overflow-hidden relative">
        
        {/* Left Side: Restored Images (60% Width) */}
        <div 
          className="w-[60%] relative h-full hidden md:block overflow-hidden bg-slate-200 transition-all duration-700"
          style={{
            backgroundImage: `url(https://images.weserv.nl/?url=github.com/user-attachments/assets/${
              activeSlide === 0 ? 'e57d96f1-771d-46ef-9b53-80ab4de31a1a' :
              activeSlide === 1 ? '45bfee96-e9fd-4197-ba17-47532032cc82' :
              activeSlide === 2 ? '6c5412fa-21f4-4ad0-a40a-beaa75383b45' :
              activeSlide === 3 ? '93bac3f5-e2c8-4b79-b413-47c5c8bbb716' :
              'e74ccfac-6bb7-420a-96b4-96994867d93c'
            }&w=50&blur=5&output=webp)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {/* Primary Slide: Eager Load + Proxy */}
          <img 
            src="https://images.weserv.nl/?url=github.com/user-attachments/assets/e57d96f1-771d-46ef-9b53-80ab4de31a1a&w=1200&output=webp" 
            alt="MRI Precision" 
            fetchPriority="high"
            loading="eager"
            className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ${activeSlide === 0 ? 'opacity-100' : 'opacity-0'}`} 
          />

          {/* Secondary Slides: Post-Mount Lazy Load + Proxy */}
          {isMounted && (
            <>
              <img 
                src="https://images.weserv.nl/?url=github.com/user-attachments/assets/45bfee96-e9fd-4197-ba17-47532032cc82&w=1200&output=webp" 
                alt="Clinical Care" 
                loading="lazy"
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${activeSlide === 1 ? 'opacity-100' : 'opacity-0'}`} 
              />
              <img 
                src="https://images.weserv.nl/?url=github.com/user-attachments/assets/6c5412fa-21f4-4ad0-a40a-beaa75383b45&w=1200&output=webp" 
                alt="Modern Surgery" 
                loading="lazy"
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${activeSlide === 2 ? 'opacity-100' : 'opacity-0'}`} 
              />
              <img 
                src="https://images.weserv.nl/?url=github.com/user-attachments/assets/93bac3f5-e2c8-4b79-b413-47c5c8bbb716&w=1200&output=webp" 
                alt="Expert Medical Consultation" 
                loading="lazy"
                className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ${activeSlide === 3 ? 'opacity-100' : 'opacity-0'}`} 
              />
              <img 
                src="https://images.weserv.nl/?url=github.com/user-attachments/assets/e74ccfac-6bb7-420a-96b4-96994867d93c&w=1200&output=webp" 
                alt="Advanced Diagnostics" 
                loading="lazy"
                className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ${activeSlide === 4 ? 'opacity-100' : 'opacity-0'}`} 
              />
            </>
          )}
          
          {/* Right side fade overlay */}
          <div className="absolute inset-y-0 right-0 w-[45%] bg-gradient-to-r from-transparent via-white/40 to-white pointer-events-none z-10"></div>
        </div>

        {/* Phase 3: Form Container Padding (Right Side - 40% Width) */}
        <div className="w-full md:w-[40%] flex flex-col justify-center pl-[8%] pr-[8%] bg-white md:py-0">
          <div className="max-w-[420px] w-full mx-auto">
            <h1 className="font-heading font-extrabold text-3xl text-slate-800 mb-1 leading-tight tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Secure Access</span> to Care
            </h1>
            <p className="text-slate-500 text-[14px] mb-4 leading-relaxed font-medium">
              {isLoginMode ? 'Login to access your dashboard.' : 'Register for clinical access instantly.'}
            </p>
            
            <form className="space-y-3" onSubmit={handleSubmit}>
              {/* Phase 4: Role Selector Text Visibility Fix */}
              <div className="bg-slate-100 p-1 rounded-xl flex gap-1.5 mb-4">
                {['patient', 'doctor', 'admin'].map((role) => (
                  <label key={role} className="flex-1 text-center cursor-pointer relative">
                    <input 
                      checked={form.role === role}
                      onChange={(e) => setForm({...form, role: e.target.value})}
                      className="peer sr-only" name="role" type="radio" value={role} 
                    />
                    <div className="w-full h-full py-2 flex items-center justify-center transition-all duration-300 capitalize rounded-lg text-slate-600 font-medium text-xs hover:bg-slate-200 peer-checked:bg-emerald-600 peer-checked:text-white peer-checked:shadow-sm peer-checked:font-bold">
                      {role}
                    </div>
                  </label>
                ))}
              </div>

              <div className="space-y-2">
                {!isLoginMode && (
                  <input 
                    value={form.fullName} onChange={e=>setForm({...form, fullName: e.target.value})} required={!isLoginMode}
                    className="w-full h-[46px] px-4 bg-slate-50 border border-slate-200 rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-slate-400" 
                    placeholder="Full Name" type="text" 
                  />
                )}
                
                <div className={!isLoginMode ? "grid grid-cols-2 gap-2" : "grid grid-cols-1"}>
                  <input 
                    value={form.email} onChange={e=>setForm({...form, email: e.target.value})} required
                    className="w-full h-[46px] px-4 bg-slate-50 border border-slate-200 rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-slate-400" 
                    placeholder="Email" type="email" 
                  />
                  {!isLoginMode && (
                    <input 
                      value={form.phone} onChange={e=>setForm({...form, phone: e.target.value})} required={!isLoginMode}
                      className="w-full h-[46px] px-4 bg-slate-50 border border-slate-200 rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-slate-400" 
                      placeholder="Phone" type="tel" 
                    />
                  )}
                </div>
                
                <input 
                  value={form.password} onChange={e=>setForm({...form, password: e.target.value})} required
                  className="w-full h-[46px] px-4 bg-slate-50 border border-slate-200 rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-slate-400" 
                  placeholder="Password" type="password" 
                />
              </div>

              <button disabled={loading} type="submit" className="w-full h-[46px] bg-emerald-600 text-white font-bold uppercase tracking-widest text-[12px] rounded-xl transition-all shadow-md mt-2 cursor-pointer hover:bg-emerald-700 active:scale-[0.98]">
                {loading ? 'Processing...' : (isLoginMode ? 'Login Now' : 'Register Now')}
              </button>

              <a href={GOOGLE_AUTH_URL} className="block text-decoration-none w-full mt-2">
                <button type="button" className="w-full h-[46px] bg-white border border-slate-200 text-slate-700 font-bold text-[12px] rounded-xl hover:bg-slate-50 transition-all flex items-center justify-center gap-3 shadow-sm cursor-pointer">
                  <svg className="size-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                  </svg>
                  Continue with Google
                </button>
              </a>

              <p className="text-center text-[12px] text-slate-500 mt-1">
                {isLoginMode ? "Don't have an account? " : "Already registered? "}
                <button type="button" onClick={() => setIsLoginMode(!isLoginMode)} className="text-emerald-600 font-bold hover:underline cursor-pointer">
                  {isLoginMode ? 'Register here' : 'Login here'}
                </button>
              </p>
            </form>
          </div>
        </div>
      </main>

      {/* Marquee Section (31% Height) */}
      <section className="h-[31vh] flex flex-col justify-start pt-3 bg-slate-50 border-y border-slate-100 overflow-hidden">
        <div className="w-full max-w-[1280px] mx-auto mb-3">
          <h3 className="text-center font-heading font-bold text-slate-600 text-sm uppercase tracking-[0.2em]">Our Excellence & Accreditations</h3>
        </div>
        
        <div className="relative w-full flex overflow-hidden">
          <motion.div 
            className="flex gap-12 whitespace-nowrap"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ 
              duration: 35, 
              repeat: Infinity, 
              ease: "linear" 
            }}
          >
            {[...certificates, ...certificates, ...certificates].map((item, i) => (
              <div 
                key={i} 
                className="flex flex-col items-center gap-3 bg-white px-8 py-6 rounded-2xl border border-slate-100 shadow-sm min-w-[220px]"
              >
                <div className="size-14 rounded-full bg-emerald-50 flex items-center justify-center">
                  <span className="material-symbols-outlined text-3xl text-emerald-600" style={{fontVariationSettings: "'FILL' 1"}}>{item.icon}</span>
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">{item.text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* New Modular Sections */}
      <div id="services"><ServicesSection /></div>
      <div id="why-us"><WhyUsSection /></div>
      <div id="contact"><ContactAndFooter /></div>
    </div>
  );
}
