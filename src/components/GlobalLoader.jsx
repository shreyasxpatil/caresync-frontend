import { motion } from 'framer-motion';
import { HeartPulse } from 'lucide-react';

export default function GlobalLoader({ text = "Loading...", fullScreen = false }) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-6 p-8">
      <div className="relative flex items-center justify-center size-20">
        {/* Outer glowing rings */}
        <motion.div 
          animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-emerald-400 rounded-full blur-xl"
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
          className="absolute inset-0 bg-teal-400 rounded-full blur-md"
        />
        
        {/* Core icon container */}
        <div className="relative size-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-xl shadow-emerald-200 flex items-center justify-center border-2 border-white z-10">
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <HeartPulse className="size-8 text-white" />
          </motion.div>
        </div>
      </div>
      
      <div className="flex flex-col items-center gap-2">
        <motion.p 
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="font-heading font-black text-slate-800 tracking-[0.2em] uppercase text-[11px]"
        >
          {text}
        </motion.p>
        <div className="flex gap-1.5 mt-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -6, 0], opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
              className="size-1.5 bg-emerald-500 rounded-full"
            />
          ))}
        </div>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-slate-50/80 backdrop-blur-md z-[100] flex items-center justify-center min-h-screen">
        {content}
      </div>
    );
  }

  return (
    <div className="w-full py-20 flex items-center justify-center">
      {content}
    </div>
  );
}
