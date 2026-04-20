import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import { Send, User, Bot, Volume2, ArrowLeft, Sparkles, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/src/lib/utils';
import { saudiData } from '@/src/data/lessons';

interface Message {
  role: 'user' | 'model';
  text: string;
}

export function Practice() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'স্বাগতম! আমি আপনার সৌদি আরবি শিক্ষক। আমার সাথে কথোপকথন শুরু করুন অথবা কোনো শব্দ বা বাক্য সম্পর্কে জিজ্ঞাসা করুন।' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize Gemini
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      // Craft a system prompt based on our vocabulary
      const vocabContext = saudiData.categories.map(cat => 
        `Category: ${cat.title}\nPhrases: ${cat.phrases.map(p => `${p.arabic} - ${p.bangla}`).join(', ')}`
      ).join('\n\n');

      const systemInstruction = `
        You are a friendly Saudi Arabic language tutor for Bengali speakers. 
        Your goal is to help users practice Saudi Arabic (especially the Saudi dialect).
        
        Rules:
        1. Always be encouraging.
        2. If the user greets you in Bengali or English, respond in Saudi Arabic with Bengali translation.
        3. Use the following vocabulary as a reference for accuracy, but you can go beyond it if needed for natural conversation:
        ${vocabContext}
        
        4. When you provide an Arabic phrase, always include:
           - The Arabic script (or phonetic if the user prefers)
           - The Bengali meaning
           - A short explanation if it's a specific Saudi dialect usage.
        
        5. Keep responses concise and focused on language learning.
        6. If the user asks "How do I say X in Saudi?", provide the answer clearly.
        
        Respondent in a mix of Bengali and Saudi Arabic.
      `;

      const chat = ai.chats.create({
        model: "gemini-3-flash-preview",
        config: {
          systemInstruction,
        }
      });

      // We send full history to maintain context
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const result = await chat.sendMessage({
        message: userMessage,
      });

      const modelResponse = result.text;
      setMessages(prev => [...prev, { role: 'model', text: modelResponse }]);
    } catch (error) {
      console.error("Gemini Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: 'দুঃখিত, বর্তমানে আমি আপনার উত্তর দিতে পারছি না। অনুগ্রহ করে পরে আবার চেষ্টা করুন।' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const speak = (text: string) => {
    // Basic detection of Arabic text within the response
    const arabicRegex = /[\u0600-\u06FF]/;
    if (arabicRegex.test(text)) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-[calc(100vh-140px)]"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link to="/" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft size={20} className="text-navy-dark" />
        </Link>
        <div>
          <h2 className="text-xl font-bold text-navy-dark flex items-center gap-2">
            এআই প্র্যাকটিস
            <Sparkles size={16} className="text-amber-500 fill-amber-500" />
          </h2>
          <p className="text-xs text-ink-muted">সরাসরি আরবিতে কথা বলা শিখুন</p>
        </div>
      </div>

      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-4 p-2 no-scrollbar"
      >
        <AnimatePresence mode="popLayout">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={cn(
                "flex gap-3 max-w-[85%]",
                msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm",
                msg.role === 'user' ? "bg-navy-dark text-white" : "bg-white text-navy-dark border border-navy/10"
              )}>
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={cn(
                "p-3 rounded-2xl relative group",
                msg.role === 'user' 
                  ? "bg-navy-dark text-white rounded-tr-none" 
                  : "bg-white text-ink shadow-sm border border-navy/5 rounded-tl-none"
              )}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                {msg.role === 'model' && (
                  <button 
                    onClick={() => speak(msg.text)}
                    className="absolute -right-10 top-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-navy-dark"
                  >
                    <Volume2 size={16} />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isLoading && (
          <div className="flex gap-3 mr-auto">
            <div className="w-8 h-8 rounded-full bg-white text-navy-dark border border-navy/10 flex items-center justify-center">
              <Bot size={16} className="animate-pulse" />
            </div>
            <div className="bg-white p-3 rounded-2xl shadow-sm border border-navy/5 flex gap-1">
              <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="mt-4 p-3 bg-white rounded-3xl shadow-lg border border-navy/5 flex items-center gap-2">
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="আপনার মেসেজ লিখুন..."
          className="flex-1 bg-transparent px-2 py-1 text-sm outline-none font-medium"
        />
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          className="w-10 h-10 bg-navy-dark text-white rounded-2xl flex items-center justify-center shadow-lg disabled:opacity-50 disabled:grayscale transition-all"
        >
          <Send size={18} />
        </motion.button>
      </div>
    </motion.div>
  );
}
