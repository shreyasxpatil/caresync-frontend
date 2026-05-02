import React from 'react';
import { motion } from 'framer-motion';
import { HeartPulse, Brain, Bone, Ambulance } from 'lucide-react';

const ServiceBackground = ({ src }) => {
  const optimizedUrl = src.includes('github.com') 
    ? `https://images.weserv.nl/?url=${src.replace('https://', '')}&w=800&output=webp`
    : src;
  const lqipUrl = src.includes('github.com')
    ? `https://images.weserv.nl/?url=${src.replace('https://', '')}&w=50&blur=5&output=webp`
    : src;

  return (
    <div 
      className="absolute inset-0 z-0 opacity-30 pointer-events-none transition-transform duration-700 group-hover:scale-110 bg-slate-200"
      style={{
        backgroundImage: `url(${lqipUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <img 
        src={optimizedUrl} 
        alt="Service Background" 
        className="w-full h-full object-cover"
        loading="lazy"
      />
    </div>
  );
};

export default function ServicesSection() {
  const services = [
    {
      id: 'cardio',
      title: 'Cardiology',
      desc: 'Advanced heart care, ECG, and cardiovascular surgeries.',
      icon: HeartPulse,
      image: 'https://github.com/user-attachments/assets/5fe0585d-dd60-4517-92a8-47befaa1089e',
      colSpan: 'md:col-span-2',
      bgClass: 'bg-white',
      textClass: 'text-slate-800',
      iconColor: 'text-emerald-500'
    },
    {
      id: 'neuro',
      title: 'Neurology',
      desc: 'Comprehensive neurological exams and treatments.',
      icon: Brain,
      image: 'https://github.com/user-attachments/assets/395fd240-1664-4717-8ec9-51fb13b0f4ac',
      colSpan: 'md:col-span-1',
      bgClass: 'bg-white',
      textClass: 'text-slate-800',
      iconColor: 'text-emerald-500'
    },
    {
      id: 'ortho',
      title: 'Orthopedics',
      desc: 'Joint replacement, sports medicine, and bone health.',
      icon: Bone,
      image: 'https://github.com/user-attachments/assets/4135e9ba-143a-471b-bef4-3c8fe3ddfd84',
      colSpan: 'md:col-span-1',
      bgClass: 'bg-white',
      textClass: 'text-slate-800',
      iconColor: 'text-emerald-500'
    },
    {
      id: 'emergency',
      title: 'Emergency Care',
      desc: '24/7 critical care, trauma center, and rapid response.',
      icon: Ambulance,
      image: 'https://github.com/user-attachments/assets/0a91aa41-c8b2-40e4-b9d7-101d64a138c6',
      colSpan: 'md:col-span-2',
      bgClass: 'bg-slate-900',
      textClass: 'text-white',
      iconColor: 'text-red-500 animate-pulse'
    }
  ];

  return (
    <section className="pt-12 pb-24 bg-slate-50 relative">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-heading font-extrabold text-[42px] leading-tight mb-4 tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
              Our Medical Specialties
            </span>
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg font-medium">
            State-of-the-art facilities equipped to provide world-class clinical precision across a spectrum of advanced disciplines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((svc) => (
            <motion.div
              key={svc.id}
              whileHover={{ y: -8 }}
              className={`group rounded-[2.5rem] p-10 border border-slate-200 transition-all duration-300 hover:shadow-[0_0_40px_rgba(16,185,129,0.15)] hover:border-emerald-200 cursor-pointer relative overflow-hidden ${svc.colSpan} ${svc.bgClass}`}
            >
              {/* Actual Service Image Background */}
              <ServiceBackground src={svc.image} />

              {/* Text and Icon Layer (Preserved styling sitting above background) */}
              <div className="h-full flex flex-col justify-between min-h-[240px] relative z-10">
                <div className="mb-8">
                  <svc.icon className={`w-14 h-14 ${svc.iconColor} transition-transform duration-300 group-hover:scale-110`} />
                </div>
                <div>
                  <h3 className={`font-heading font-bold text-3xl mb-4 ${svc.textClass}`}>
                    {svc.title}
                  </h3>
                  <p className={`text-[16px] leading-relaxed opacity-80 ${svc.textClass} max-w-md`}>
                    {svc.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
