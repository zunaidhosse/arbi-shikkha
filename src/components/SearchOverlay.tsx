import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, Volume2, ArrowRight } from 'lucide-react';
import { saudiData } from '@/src/data/lessons';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/src/lib/utils';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const results = useMemo(() => {
    if (!query.trim()) return [];
    
    const searchTerms = query.toLowerCase().split(' ');
    const matched: any[] = [];

    saudiData.categories.forEach(category => {
      category.phrases.forEach(phrase => {
        const matches = searchTerms.every(term => 
          phrase.bangla.toLowerCase().includes(term) ||
          phrase.arabic.toLowerCase().includes(term) ||
          phrase.pronunciation.toLowerCase().includes(term)
        );

        if (matches) {
          matched.push({ ...phrase, categoryId: category.id, categoryTitle: category.title });
        }
      });
    });

    return matched.slice(0, 20); // Limit results for performance
  }, [query]);

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-SA';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] p-4 flex flex-col"
        >
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white rounded-3xl w-full max-w-2xl mx-auto shadow-2xl flex flex-col max-h-[80vh] overflow-hidden"
          >
            {/* Search Header */}
            <div className="p-4 border-b flex items-center gap-3">
              <Search className="text-slate-400" size={20} />
              <input
                autoFocus
                type="text"
                placeholder="শব্দ বা বাক্য খুঁজুন..."
                className="flex-1 bg-transparent border-none outline-none text-lg font-medium placeholder:text-slate-300"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button 
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Results Area */}
            <div className="flex-1 overflow-y-auto p-2">
              {query && results.length === 0 ? (
                <div className="p-12 text-center text-slate-400">
                  <p className="font-medium text-lg">কোনো ফলাফল পাওয়া যায়নি</p>
                  <p className="text-sm">অন্য কিছু লিখে চেষ্টা করুন</p>
                </div>
              ) : query === '' ? (
                <div className="p-8 text-center text-slate-400">
                  <p className="text-sm">সহজে কোনো আরবি শব্দ বা বাক্য খুঁজে পেতে নিচে টাইপ করুন।</p>
                  <p className="text-[10px] uppercase font-bold mt-2 opacity-60">যেমন: ভাত, পানি, ওষুধ, আসসালামু আলাইকুম</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {results.map((result) => (
                    <div
                      key={result.id}
                      className="p-4 hover:bg-slate-50 rounded-2xl transition-all cursor-pointer group flex items-center gap-4"
                      onClick={() => {
                        navigate(`/category/${result.categoryId}`);
                        onClose();
                      }}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[9px] font-black uppercase text-navy bg-navy-light px-1.5 py-0.5 rounded leading-none tracking-wider">
                            {result.categoryTitle}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-slate-800 mb-1">{result.bangla}</p>
                        <p className="text-lg font-bold text-navy-dark leading-none" dir="rtl">{result.arabic.split('(')[0]}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            speak(result.arabic);
                          }}
                          className="p-2 text-slate-400 hover:text-navy hover:bg-navy-light rounded-full transition-all"
                        >
                          <Volume2 size={18} />
                        </button>
                        <ArrowRight size={18} className="text-slate-300 group-hover:text-navy transition-colors transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
          {/* Click to close backdrop zone */}
          <div className="flex-1" onClick={onClose} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
