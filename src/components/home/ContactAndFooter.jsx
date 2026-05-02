import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Siren, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ContactAndFooter() {
  const contactMethods = [
    { icon: Phone, title: 'Call Us', detail: '7821938067' },
    { icon: Mail, title: 'Email Us', detail: 'care@caresync.med' },
    { icon: MapPin, title: 'Visit Us', detail: 'Viman Nagar, Pune, MH' }
  ];

  return (
    <>
      <section className="relative py-24 bg-white overflow-hidden border-t border-slate-100">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#10b981 1.5px, transparent 1.5px)', backgroundSize: '32px 32px' }}></div>
        
        <div className="max-w-[1280px] mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            
            {/* Left Side: Contact Info */}
            <div>
              <h2 className="font-heading font-extrabold text-[42px] text-slate-900 mb-4 tracking-tight">
                Get in Touch
              </h2>
              <p className="text-slate-500 text-lg font-medium mb-10">
                Our support team is available 24/7 to assist you with appointments, medical inquiries, and patient portal access.
              </p>
              
              <div className="space-y-4">
                {contactMethods.map((method, idx) => (
                  <div 
                    key={idx} 
                    className="group flex items-center p-6 bg-slate-50/80 backdrop-blur-sm border border-slate-100 rounded-2xl transition-all duration-300 hover:bg-white hover:shadow-lg hover:border-emerald-100 cursor-pointer"
                  >
                    <div className="size-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 mr-6 transition-transform duration-300 group-hover:rotate-12">
                      <method.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1">{method.title}</h4>
                      <p className="text-[17px] font-semibold text-slate-800 transition-colors duration-300 group-hover:text-emerald-600">{method.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side: Smart Form */}
            <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-[0_0_40px_rgba(0,0,0,0.04)] border border-slate-100">
              <h3 className="font-heading font-bold text-2xl text-slate-800 mb-8">Send a Message</h3>
              <form 
                className="space-y-6" 
                onSubmit={async (e) => {
                  e.preventDefault();
                  const btn = e.currentTarget.querySelector('button');
                  const formData = new FormData(e.currentTarget);
                  const data = Object.fromEntries(formData.entries());
                  
                  try {
                    btn.disabled = true;
                    btn.innerText = 'Sending...';
                    const api = (await import('../../api/axios')).default;
                    const toast = (await import('react-hot-toast')).default;
                    await api.post('/contact', data);
                    toast.success('Message delivered successfully!');
                    e.target.reset();
                  } catch (err) {
                    const toast = (await import('react-hot-toast')).default;
                    toast.error('Failed to deliver message. Please try again.');
                  } finally {
                    btn.disabled = false;
                    btn.innerHTML = 'Send Message <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
                  }
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input 
                    type="text" 
                    name="name"
                    placeholder="Your Name" 
                    required
                    className="w-full bg-slate-50/50 border-0 border-b-2 border-slate-200 px-4 py-3 text-[14px] focus:ring-0 focus:border-emerald-500 transition-colors font-medium text-slate-800 placeholder:text-slate-400"
                  />
                  <input 
                    type="email" 
                    name="email"
                    placeholder="Email Address" 
                    required
                    className="w-full bg-slate-50/50 border-0 border-b-2 border-slate-200 px-4 py-3 text-[14px] focus:ring-0 focus:border-emerald-500 transition-colors font-medium text-slate-800 placeholder:text-slate-400"
                  />
                </div>
                <input 
                  type="text" 
                  name="subject"
                  placeholder="Subject" 
                  required
                  className="w-full bg-slate-50/50 border-0 border-b-2 border-slate-200 px-4 py-3 text-[14px] focus:ring-0 focus:border-emerald-500 transition-colors font-medium text-slate-800 placeholder:text-slate-400"
                />
                <textarea 
                  name="message"
                  rows="4"
                  placeholder="How can we help you?" 
                  required
                  className="w-full bg-slate-50/50 border-0 border-b-2 border-slate-200 px-4 py-3 text-[14px] focus:ring-0 focus:border-emerald-500 transition-colors resize-none font-medium text-slate-800 placeholder:text-slate-400"
                ></textarea>
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-emerald-600 text-white font-bold uppercase tracking-widest text-[13px] py-4 rounded-xl shadow-md hover:bg-emerald-700 flex items-center justify-center gap-2 mt-4 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send Message
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </form>
            </div>

          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            {/* Left Side: Address Info */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <h2 className="font-heading font-extrabold text-[36px] text-slate-900 mb-6 tracking-tight">
                  Visit Our Facility
                </h2>
                <div className="flex items-start gap-4 mb-6">
                  <div className="size-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 mb-1">Main Campus</h4>
                    <p className="text-slate-600 leading-relaxed">
                      CareSync Multispeciality Hospital,<br/>
                      Viman Nagar, Pune, Maharashtra 411014
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-500">near_me</span>
                  Nearby Landmarks
                </h4>
                <ul className="space-y-3">
                  <li className="flex justify-between text-sm">
                    <span className="text-slate-500">Phoenix Marketcity</span>
                    <span className="font-bold text-emerald-600">2 mins</span>
                  </li>
                  <li className="flex justify-between text-sm">
                    <span className="text-slate-500">Pune International Airport</span>
                    <span className="font-bold text-emerald-600">5 mins</span>
                  </li>
                  <li className="flex justify-between text-sm">
                    <span className="text-slate-500">Hyatt Regency Pune</span>
                    <span className="font-bold text-emerald-600">1 min</span>
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Right Side: Google Map */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="h-[450px] rounded-3xl overflow-hidden border-4 border-white shadow-2xl relative z-10"
            >
              <iframe 
                src="https://www.google.com/maps?q=Viman+Nagar,+Pune+CareSync+Multispeciality+Hospital&output=embed" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Emergency Strip */}
      <section className="bg-red-600 py-10 relative z-20 overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-6 flex flex-col md:flex-row items-center justify-center gap-6 text-center">
          <Siren className="w-10 h-10 text-white animate-pulse" />
          <h2 className="font-heading font-extrabold text-[28px] md:text-[32px] text-white tracking-tight">
            MEDICAL EMERGENCY?
          </h2>
          <button className="bg-white text-red-700 font-black uppercase tracking-widest text-[14px] px-10 py-4 rounded-full hover:scale-105 transition-transform shadow-xl cursor-pointer ml-0 md:ml-4">
            Dial 911
          </button>
        </div>
      </section>

      {/* Main Footer */}
      <footer className="bg-slate-950 text-slate-400 pt-24 pb-8 border-t-[8px] border-emerald-600">
        <div className="max-w-[1280px] mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          <div className="col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="size-8 text-emerald-500">
                <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                  <path d="M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08v0c.85.85 2.23.85 3.08 0L15 8"></path>
                </svg>
              </div>
              <span className="font-heading font-bold text-2xl text-white tracking-tighter uppercase">CareSync</span>
            </div>
            <p className="text-[14px] leading-relaxed pr-6 opacity-80">Institutional trust through clinical precision. Secure, immediate access to world-class healthcare.</p>
          </div>
          <div className="col-span-1">
            <h4 className="font-heading font-bold text-white mb-6 uppercase tracking-widest text-[11px] opacity-60">Quick Links</h4>
            <ul className="space-y-4 text-[14px]">
              <li><Link to="/" className="hover:text-emerald-400 transition-colors">About Us</Link></li>
              <li><Link to="/" className="hover:text-emerald-400 transition-colors">Our Services</Link></li>
              <li><Link to="/" className="hover:text-emerald-400 transition-colors">Why Choose Us</Link></li>
            </ul>
          </div>
          <div className="col-span-1">
            <h4 className="font-heading font-bold text-white mb-6 uppercase tracking-widest text-[11px] opacity-60">Legal</h4>
            <ul className="space-y-4 text-[14px]">
              <li><Link to="/" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/" className="hover:text-emerald-400 transition-colors">Terms of Service</Link></li>
              <li><Link to="/" className="hover:text-emerald-400 transition-colors">HIPAA Compliance</Link></li>
            </ul>
          </div>
          <div className="col-span-1">
            <h4 className="font-heading font-bold text-white mb-6 uppercase tracking-widest text-[11px] opacity-60">Portals</h4>
            <ul className="space-y-4 text-[14px]">
              <li><Link to="/" className="hover:text-emerald-400 transition-colors">Patient Login</Link></li>
              <li><Link to="/" className="hover:text-emerald-400 transition-colors">Doctor Access</Link></li>
              <li><Link to="/" className="hover:text-emerald-400 transition-colors">Admin Dashboard</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-[1280px] mx-auto px-8 border-t border-slate-800/80 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[12px] font-medium opacity-60">
          <p>© 2026 CareSync Medical Group. Precision First Healthcare.</p>
          <p>Designed with clinical precision.</p>
        </div>
      </footer>
    </>
  );
}
