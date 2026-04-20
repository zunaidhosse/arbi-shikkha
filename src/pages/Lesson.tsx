import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { saudiData } from '@/src/data/lessons';
import { ChevronLeft, Volume2, Bookmark, BookmarkCheck, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useProgress } from '@/src/lib/progress';

export function Lesson() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isTestMode, setIsTestMode] = useState(false);
  const [revealedIds, setRevealedIds] = useState<string[]>([]);
  const { learned, toggleLearned } = useProgress();

  const category = saudiData.categories.find(c => c.id === categoryId);

  useEffect(() => {
    const saved = localStorage.getItem('arbi_favorites');
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  const toggleFavorite = (id: string) => {
    const newFavs = favorites.includes(id) 
      ? favorites.filter(f => f !== id) 
      : [...favorites, id];
    setFavorites(newFavs);
    localStorage.setItem('arbi_favorites', JSON.stringify(newFavs));
  };

  const toggleReveal = (id: string) => {
    if (!isTestMode) return;
    setRevealedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-SA';
    window.speechSynthesis.speak(utterance);
  };

  if (!category) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 bg-white rounded-full shadow-sm border border-slate-100 active:scale-90 transition-transform"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h2 className="text-xl font-bold text-slate-800">{category.title}</h2>
            <p className="text-xs text-slate-500">{category.phrases.length} টি বাক্য</p>
          </div>
        </div>
        
        <button
          onClick={() => setIsTestMode(!isTestMode)}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all",
            isTestMode 
              ? "bg-navy text-white shadow-[0_0_10px_rgba(26,35,126,0.3)]" 
              : "bg-slate-100 text-slate-500 border border-slate-200"
          )}
        >
          {isTestMode ? <Eye size={14} /> : <EyeOff size={14} />}
          {isTestMode ? 'টেস্ট মোড অন' : 'টেস্ট মোড'}
        </button>
      </div>

      <div className="space-y-4">
        {category.phrases.map((phrase, index) => {
          const isRevealed = !isTestMode || revealedIds.includes(phrase.id);
          
          return (
            <motion.div
              key={phrase.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => isTestMode && toggleReveal(phrase.id)}
              className={cn(
                "card-polish p-5 space-y-4 relative overflow-hidden group transition-all duration-500",
                isTestMode && !isRevealed && "cursor-pointer hover:border-navy"
              )}
            >
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <span className="category-tag text-[10px] text-ink-muted font-bold tracking-widest uppercase">{category.title}</span>
                  <p className={cn(
                    "text-sm font-medium transition-all duration-500",
                    isRevealed ? "text-ink-muted" : "text-transparent bg-slate-200 animate-pulse rounded select-none blur-[4px]"
                  )}>
                    {phrase.bangla}
                  </p>
                </div>
                <div className="flex gap-2 relative z-10" onClick={(e) => e.stopPropagation()}>
                  <button 
                    onClick={() => toggleLearned(phrase.id)}
                    className={cn(
                      "p-2 rounded-full transition-all duration-300",
                      learned.includes(phrase.id) ? "text-emerald-500 bg-emerald-50 shadow-sm" : "text-slate-300 hover:text-navy"
                    )}
                  >
                    <CheckCircle size={18} fill={learned.includes(phrase.id) ? "currentColor" : "none"} fillOpacity={0.2} />
                  </button>
                  <button 
                    onClick={() => toggleFavorite(phrase.id)}
                    className={cn(
                      "p-2 rounded-full transition-all duration-300",
                      favorites.includes(phrase.id) ? "text-amber-500 bg-amber-50 shadow-sm" : "text-slate-300 hover:text-navy"
                    )}
                  >
                    {favorites.includes(phrase.id) ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                  </button>
                  <button 
                    onClick={() => speak(phrase.arabic)}
                    className="p-2 text-navy bg-navy-light rounded-full hover:bg-navy-dark hover:text-white transition-all shadow-sm"
                  >
                    <Volume2 size={18} />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <p 
                  onClick={(e) => { e.stopPropagation(); speak(phrase.arabic); }}
                  className="text-3xl font-bold text-navy-dark leading-tight text-right tracking-tight cursor-pointer hover:text-blue-600 transition-colors active:scale-95 transform arabic-font" 
                  dir="rtl"
                >
                  {phrase.arabic.split('(')[0].trim()}
                </p>
                
                <div className={cn(
                  "bg-[#F9FAFB] p-3 rounded-lg border-l-4 border-l-navy transition-all duration-500",
                  isRevealed ? "opacity-100" : "opacity-0 blur-lg select-none"
                )}>
                  <p className="text-sm italic text-slate-600 font-medium">{phrase.pronunciation}</p>
                  {phrase.literalBangla && (
                    <div className="mt-2 pt-2 border-t border-slate-100 flex items-center gap-2">
                      <span className="text-[10px] font-bold text-navy bg-navy-light px-1.5 py-0.5 rounded leading-none uppercase tracking-wider">আক্ষরিক অর্থ</span>
                      <p className="text-xs text-slate-500 font-normal">{phrase.literalBangla}</p>
                    </div>
                  )}
                </div>
                
                {isTestMode && !isRevealed && (
                  <div className="absolute inset-x-0 bottom-0 py-2 bg-navy/5 flex justify-center items-center gap-2">
                    <Eye size={12} className="text-navy" />
                    <span className="text-[10px] font-bold text-navy uppercase tracking-wider">দেখতে ক্লিক করুন</span>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
