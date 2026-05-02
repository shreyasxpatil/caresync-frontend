import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Send, Bot, ChevronDown } from 'lucide-react';

const SYSTEM_PROMPT = `You are "AI Care", the official intelligent assistant for CareSync Hospital. 
You are warm, conversational, and professional. 

STRICT RULES:
1. NEVER repeat the same phrase twice in a row. Avoid robotic openings like "I understand you are asking about..."
2. Attempt to answer all user questions to the best of your ability. If you don't have specific data, provide general hospital guidance and suggest they contact the hospital at 7821938067.
3. Be concise but helpful. Use bullet points for lists.
4. Always maintain a clinical yet friendly tone.
5. If a user asks why a specific doctor (like Shreyash Patil) is "expensive", explain that fees are based on specialization, years of experience, and the complexity of the clinical department.`;

const ThinkingDots = () => (
  <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-br from-emerald-50 to-teal-50 border border-teal-100 rounded-2xl rounded-tl-sm max-w-[70%] self-start">
    <span className="text-sm text-teal-700 font-medium">AI Care is thinking</span>
    <div className="flex gap-1 items-center">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 block"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
        />
      ))}
    </div>
  </div>
);

export default function CareAIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      content: "Hello! I'm **AI Care**, your intelligent health assistant at CareSync. How can I assist you today?",
      id: 'welcome',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPopup(true);
      // Auto-hide after another 7 seconds
      setTimeout(() => setShowPopup(false), 7000);
    }, 10000); // 10 seconds delay
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isOpen) setShowPopup(false);
  }, [isOpen]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const formatMessage = (text) => {
    // Simple bold (**text**) and newline rendering
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br/>');
  };

  const handleSendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage = { role: 'user', content: trimmed, id: Date.now().toString() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) throw new Error('VITE_GEMINI_API_KEY is not set in your .env file.');

      // Build the chat history for the API
      const history = messages
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({
          role: m.role === 'ai' ? 'model' : 'user',
          parts: [{ text: m.content }],
        }));

      const payload = {
        contents: [
          { 
            role: 'user', 
            parts: [{ text: `SYSTEM INSTRUCTION: ${SYSTEM_PROMPT}\n\nUser is now starting the chat.` }] 
          },
          {
            role: 'model',
            parts: [{ text: "Understood. I am AI Care, the professional and empathetic assistant for CareSync Hospital. I will assist with appointments and guidance while maintaining professional boundaries. How can I help you today?" }]
          },
          ...history,
          { role: 'user', parts: [{ text: trimmed }] },
        ],
        generationConfig: {
          maxOutputTokens: 250,
          temperature: 0.7,
        },
      };

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err?.error?.message || 'API request failed.');
      }

      const data = await response.json();
      const aiText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "I'm sorry, I couldn't generate a response. Please try again.";

      setMessages((prev) => [
        ...prev,
        { role: 'ai', content: aiText, id: Date.now().toString() },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          content: `I'm currently experiencing high volume and cannot process your request right now. However, for immediate assistance, please call our 24/7 helpline at 7821938067.`,
          id: Date.now().toString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-3">
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 22, stiffness: 280 }}
            className="w-[370px] h-[540px] bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.18)] border border-slate-100 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-900 via-emerald-900 to-teal-900 px-5 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
                  <Sparkles size={18} className="text-emerald-300" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm tracking-wide">AI Care</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-emerald-300 text-[10px] font-medium uppercase tracking-widest">CareSync Assistant</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <ChevronDown size={16} className="text-white/70" />
                </button>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setMessages([{ role: 'ai', content: "Hello! I'm **AI Care**, your intelligent health assistant at CareSync. How can I assist you today?", id: 'welcome' }]);
                  }}
                  className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X size={16} className="text-white/70" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'ai' && (
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shrink-0 mr-2 mt-1">
                      <Bot size={12} className="text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-slate-800 text-slate-100 rounded-tr-sm'
                        : 'bg-gradient-to-br from-emerald-50 to-teal-50 border border-teal-100 text-slate-700 rounded-tl-sm'
                    }`}
                    dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
                  />
                </motion.div>
              ))}

              {/* Thinking state */}
              <AnimatePresence>
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-start gap-2"
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shrink-0 mt-1">
                      <Bot size={12} className="text-white" />
                    </div>
                    <ThinkingDots />
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={bottomRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-slate-100 shrink-0">
              <div className="flex items-end gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 focus-within:border-emerald-400 focus-within:shadow-[0_0_0_3px_rgba(16,185,129,0.1)] transition-all">
                <textarea
                  ref={inputRef}
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask AI Care anything..."
                  disabled={isLoading}
                  className="flex-1 bg-transparent text-sm text-slate-700 placeholder-slate-400 resize-none outline-none max-h-24 leading-relaxed disabled:opacity-50"
                  style={{ fieldSizing: 'content' }}
                />
                <motion.button
                  onClick={handleSendMessage}
                  disabled={!input.trim() || isLoading}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 flex items-center justify-center shrink-0 disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_12px_rgba(20,184,166,0.4)] hover:shadow-[0_0_18px_rgba(20,184,166,0.6)] transition-shadow cursor-pointer"
                >
                  <Send size={14} className="text-white translate-x-[1px]" />
                </motion.button>
              </div>
              <p className="text-center text-[10px] text-slate-400 mt-2 font-medium">
                Powered by Care Ai · Not a substitute for medical advice
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Promotional Popup */}
      <AnimatePresence>
        {showPopup && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute bottom-[4.5rem] right-0 z-[10000] whitespace-nowrap"
          >
            <div className="relative bg-white border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.1)] px-5 py-3 rounded-2xl flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                <Bot size={16} className="text-emerald-600" />
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest leading-none mb-1">AI Care</p>
                <p className="text-slate-700 text-sm font-semibold">Have a question? Ask me!</p>
              </div>
              <button 
                onClick={() => setShowPopup(false)}
                className="ml-2 text-slate-300 hover:text-slate-500 transition-colors"
              >
                <X size={14} />
              </button>
              {/* Tooltip Tail */}
              <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white border-r border-b border-slate-100 rotate-45"></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        onClick={() => setIsOpen((prev) => !prev)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 flex items-center justify-center shadow-[0_0_20px_rgba(20,184,166,0.5)] hover:shadow-[0_0_30px_rgba(20,184,166,0.7)] transition-shadow cursor-pointer relative"
        aria-label="Open AI Care Chatbot"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <X size={22} className="text-white" />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <Sparkles size={22} className="text-white" />
            </motion.div>
          )}
        </AnimatePresence>
        {/* Notification dot for first-time users */}
        {!isOpen && messages.length === 1 && (
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white" />
        )}
      </motion.button>
    </div>
  );
}
