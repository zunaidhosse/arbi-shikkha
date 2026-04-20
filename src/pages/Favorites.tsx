import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { saudiData } from '@/src/data/lessons';
import { Bookmark, Volume2, Trash2 } from 'lucide-react';
import { Phrase } from '@/src/types';

export function Favorites() {
  const [favorites, setFavorites] = useState<Phrase[]>([]);

  useEffect(() => {
    const savedIds = JSON.parse(localStorage.getItem('arbi_favorites') || '[]');
    const allPhrases = saudiData.categories.flatMap(c => c.phrases);
    const favPhrases = allPhrases.filter(p => savedIds.includes(p.id));
    setFavorites(favPhrases);
  }, []);

  const removeFavorite = (id: string) => {
    const savedIds = JSON.parse(localStorage.getItem('arbi_favorites') || '[]');
    const newIds = savedIds.filter((fId: string) => fId !== id);
    localStorage.setItem('arbi_favorites', JSON.stringify(newIds));
    setFavorites(favorites.filter(p => p.id !== id));
  };

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-SA';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-navy-light text-navy-dark rounded-2xl flex items-center justify-center shadow-sm">
          <Bookmark size={20} fill="currentColor" />
        </div>
        <h2 className="text-xl font-bold text-ink tracking-tight">আমার প্রিয় বাক্যসমূহ</h2>
      </div>

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-slate-200 shadow-inner">
            <Bookmark size={40} />
          </div>
          <div>
            <p className="text-ink-muted font-bold tracking-tight">কোন প্রিয় বাক্য নেই</p>
            <p className="text-ink-muted text-xs mt-1 opacity-70">শেখার সময় স্টার আইকনে ক্লিক করে প্রিয়তে যোগ করুন।</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {favorites.map((phrase) => (
            <motion.div
              layout
              key={phrase.id}
              className="card-polish p-5 space-y-4 relative overflow-hidden"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="font-bold text-ink tracking-tight">{phrase.bangla}</p>
                </div>
                <div className="flex gap-2 relative z-10">
                  <button 
                    onClick={() => removeFavorite(phrase.id)}
                    className="p-2 text-red-500 hover:text-white hover:bg-red-500 bg-red-50 rounded-full transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                  <button 
                    onClick={() => speak(phrase.arabic)}
                    className="p-2 text-navy bg-navy-light rounded-full hover:bg-navy hover:text-white transition-all"
                  >
                    <Volume2 size={18} />
                  </button>
                </div>
              </div>
              <div className="p-4 bg-[#F9FAFB] rounded-xl border border-slate-100 flex flex-col gap-2">
                 <p className="text-3xl font-bold text-navy-dark text-right tracking-tight mb-1" dir="rtl">{phrase.arabic.split('(')[0]}</p>
                 <div className="h-[1px] bg-slate-200/50 w-full" />
                 <p className="text-slate-600 italic font-medium text-xs">{phrase.pronunciation}</p>
                 {phrase.literalBangla && (
                   <div className="mt-2 pt-2 border-t border-slate-100 flex items-center gap-2">
                     <span className="text-[10px] font-bold text-navy bg-navy-light px-1.5 py-0.5 rounded leading-none uppercase tracking-wider">আক্ষরিক অর্থ</span>
                     <p className="text-xs text-slate-500 font-normal">{phrase.literalBangla}</p>
                   </div>
                 )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
