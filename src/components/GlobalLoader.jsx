export default function GlobalLoader({ text = "Syncing", fullScreen = false }) {
  const content = (
    <div className="bg-transparent flex flex-col items-center justify-center p-8">
        <div className="relative flex items-center justify-center w-16 h-16 mb-2">
            
            {/* 1. The Heart (Solid Emerald color, gently pulsing) */}
            <svg className="absolute w-10 h-10 text-emerald-600 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            
            {/* 2. The ECG Line (Using emerald-100 instead of white so it is visible on white/slate cards, but still distinct from the heart) */}
            <svg className="absolute w-10 h-10 text-emerald-100 drop-shadow-md" fill="none" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path className="draw-line" stroke="currentColor" strokeWidth="1.2" d="M3 12h4l1.5-3 2 7 2.5-9 1.5 5h4" />
            </svg>

        </div>
        
        {/* Clean, minimalist text */}
        <span className="text-xs font-semibold text-emerald-700 tracking-widest uppercase flex items-center space-x-1">
            <span>{text}</span>
            <span className="flex space-x-0.5 mt-0.5 ml-1">
                <span className="w-1 h-1 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
                <span className="w-1 h-1 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></span>
                <span className="w-1 h-1 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></span>
            </span>
        </span>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-slate-50/90 backdrop-blur-sm z-[100] flex items-center justify-center min-h-screen">
        {content}
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[200px] flex items-center justify-center">
      {content}
    </div>
  );
}
