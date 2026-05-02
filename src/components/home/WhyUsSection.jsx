import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Activity, CalendarCheck, FileLock2 } from 'lucide-react';

export default function WhyUsSection() {
  const stats = [
    { label: 'Patients Treated', value: '10k+' },
    { label: 'Top Specialists', value: '50+' },
    { label: 'Success Rate', value: '99%' },
    { label: 'Emergency Support', value: '24/7' },
  ];

  const features = [
    {
      title: 'Advanced Tech',
      desc: 'AI-driven diagnostics and robotic-assisted surgeries for clinical precision.',
      icon: Activity,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'hover:border-emerald-200',
      glow: 'hover:shadow-emerald-100/50',
      node: 'border-emerald-500'
    },
    {
      title: 'Expert Doctors',
      desc: 'Board-certified specialists leading innovation in hospital care.',
      icon: ShieldCheck,
      color: 'text-violet-600',
      bg: 'bg-violet-50',
      border: 'hover:border-violet-200',
      glow: 'hover:shadow-violet-100/50',
      node: 'border-violet-500'
    },
    {
      title: 'Seamless Booking',
      desc: 'Instant appointments through our unified management interface.',
      icon: CalendarCheck,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'hover:border-blue-200',
      glow: 'hover:shadow-blue-100/50',
      node: 'border-blue-500'
    },
    {
      title: 'Secure Records',
      desc: 'Enterprise-grade encryption protecting your medical history.',
      icon: FileLock2,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      border: 'hover:border-indigo-200',
      glow: 'hover:shadow-indigo-100/50',
      node: 'border-indigo-500'
    }
  ];

  return (
    <section className="pt-10 pb-12 bg-white relative overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-heading font-extrabold text-[42px] text-slate-900 mb-4 tracking-tight">
            Why Choose CareSync
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg font-medium opacity-80">
            Our commitment to clinical excellence and cutting-edge technology defines our standard of care.
          </p>
        </div>

        {/* Stats Ribbon */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24 bg-slate-50 rounded-3xl p-10 border border-slate-100 shadow-sm">
          {stats.map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-black text-emerald-600 mb-2 font-heading tracking-tighter">
                {stat.value}
              </div>
              <div className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Professional Horizontal Timeline (Desktop) */}
        <div className="relative hidden md:block h-[450px] mb-5 mt-5">
          {/* Horizontal Track Background */}
          <div className="absolute top-1/2 left-0 w-full h-[3px] bg-slate-100 -translate-y-1/2 rounded-full overflow-hidden">
            {/* Interactive Progress Fill */}
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: '100%' }}
              viewport={{ once: true }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500"
            />
          </div>

          <div className="flex justify-between items-center h-full relative z-10">
            {features.map((feat, idx) => {
              const isTop = idx % 2 === 0;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center justify-center relative h-full">
                  
                  {/* Content Card (Alternating Top/Bottom) */}
                  <motion.div 
                    initial={{ opacity: 0, y: isTop ? -50 : 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: idx * 0.2, type: "spring", bounce: 0.3 }}
                    className={`absolute w-[280px] cursor-pointer ${isTop ? 'bottom-[calc(50%+50px)]' : 'top-[calc(50%+50px)]'}`}
                  >
                    <motion.div 
                      whileHover={{ y: isTop ? -10 : 10, scale: 1.02 }}
                      className={`bg-white p-8 rounded-[2rem] border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] ${feat.glow} ${feat.border} transition-all duration-300 relative group`}
                    >
                      <div className={`size-12 rounded-xl ${feat.bg} ${feat.color} flex items-center justify-center mb-6 transition-transform group-hover:rotate-6`}>
                         <feat.icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-bold font-heading text-slate-800 mb-3 transition-colors group-hover:text-slate-900">{feat.title}</h3>
                      <p className="text-slate-500 text-[14px] leading-relaxed font-medium">{feat.desc}</p>
                      
                      {/* Connection Pointer */}
                      <div className={`absolute left-1/2 -translate-x-1/2 w-5 h-5 bg-white rotate-45 border-slate-100 border-r border-b transition-colors ${feat.border} ${isTop ? 'bottom-[-11px]' : 'top-[-11px] rotate-[225deg]'}`}></div>
                    </motion.div>
                  </motion.div>

                  {/* Icon Badge on Track */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                    <motion.div 
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 + (idx * 0.2), type: "spring", stiffness: 200 }}
                      whileHover={{ scale: 1.25 }}
                      className={`size-16 rounded-full bg-white border-4 ${feat.node} shadow-xl flex items-center justify-center transition-all duration-300 cursor-pointer group`}
                    >
                       <feat.icon className={`w-7 h-7 ${feat.color} transition-transform group-hover:scale-110`} />
                       <div className={`absolute inset-0 rounded-full bg-current opacity-0 group-hover:animate-ping ${feat.color} opacity-10`}></div>
                    </motion.div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile View (Vertical) */}
        <div className="md:hidden space-y-10">
           {features.map((feat, idx) => (
             <motion.div 
               key={idx}
               initial={{ opacity: 0, x: -20 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               className={`p-8 rounded-[2rem] bg-white border border-slate-100 shadow-lg ${feat.border}`}
             >
                <div className={`size-14 rounded-2xl ${feat.bg} ${feat.color} flex items-center justify-center mb-6 shadow-sm`}>
                  <feat.icon className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold font-heading text-slate-800 mb-3">{feat.title}</h3>
                <p className="text-slate-500 text-[15px] leading-relaxed font-medium">{feat.desc}</p>
             </motion.div>
           ))}
        </div>
      </div>
    </section>
  );
}
