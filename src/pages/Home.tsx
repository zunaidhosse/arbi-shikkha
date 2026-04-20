import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { saudiData } from '@/src/data/lessons';
import * as Icons from 'lucide-react';
import { LucideIcon, Volume2 } from 'lucide-react';
import { useProgress } from '@/src/lib/progress';
import { cn } from '@/src/lib/utils';

export function Home() {
  const navigate = useNavigate();
  const { getTotalProgress, getCategoryProgress, streak } = useProgress();
  const totalProgress = getTotalProgress();
  const [activeDifficulty, setActiveDifficulty] = useState<'All' | 'Beginner' | 'Intermediate' | 'Advanced'>('All');

  // Word of the Day logic
  const wordOfTheDay = useMemo(() => {
    const allPhrases: any[] = [];
    saudiData.categories.forEach(cat => {
      cat.phrases.forEach(p => {
        allPhrases.push({ ...p, categoryId: cat.id, categoryTitle: cat.title });
      });
    });
    
    // Simple seed based on date
    const date = new Date();
    const seed = date.getDate() + date.getMonth() * 31;
    const index = seed % allPhrases.length;
    return allPhrases[index];
  }, []);

  const filteredCategories = useMemo(() => {
    if (activeDifficulty === 'All') return saudiData.categories;
    return saudiData.categories.filter(cat => cat.difficulty === activeDifficulty);
  }, [activeDifficulty]);

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-SA';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Header Stats */}
      <div className="flex gap-3">
        <div className="flex-1 p-4 bg-orange-50 border border-orange-100 rounded-2xl flex items-center gap-3">
          <div className={cn(
            "p-2 rounded-xl",
            streak > 0 ? "bg-orange-500 text-white shadow-lg shadow-orange-200" : "bg-slate-200 text-slate-400"
          )}>
            <Icons.Flame size={18} fill={streak > 0 ? "currentColor" : "none"} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-orange-600/60 leading-none mb-1">ধামাকা স্ট্রিক</p>
            <p className="text-lg font-black text-orange-700 leading-none">{streak} দিন</p>
          </div>
        </div>
        <div className="flex-1 p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-center gap-3">
          <div className="p-2 bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-200">
            <Icons.Trophy size={18} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-blue-600/60 leading-none mb-1">অগ্রগতি</p>
            <p className="text-lg font-black text-blue-700 leading-none">{totalProgress}%</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3">
        <button 
          onClick={() => navigate('/quiz')}
          className="flex-1 p-4 bg-white border-2 border-slate-100 rounded-2xl flex flex-col items-center gap-2 hover:border-navy-dark hover:bg-slate-50 transition-all group active:scale-95 shadow-sm"
        >
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
             <Icons.BrainCircuit size={20} />
          </div>
          <span className="text-xs font-black uppercase tracking-tight text-navy-dark">কুইজ খেলুন</span>
        </button>
        <button 
          onClick={() => navigate('/practice')}
          className="flex-1 p-4 bg-white border-2 border-slate-100 rounded-2xl flex flex-col items-center gap-2 hover:border-navy-dark hover:bg-slate-50 transition-all group active:scale-95 shadow-sm"
        >
          <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
             <Icons.MessageSquareQuote size={20} />
          </div>
          <span className="text-xs font-black uppercase tracking-tight text-navy-dark">এআই প্র্যাকটিস</span>
        </button>
      </div>

      {/* Hero / Word of the Day */}
      <div className="bg-navy-dark p-6 rounded-3xl text-white shadow-lg overflow-hidden relative border border-navy">
        <div className="relative z-10 flex flex-col gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight opacity-70 mb-1">আজকের বাক্য</h2>
            <div className="flex justify-between items-end gap-3">
              <div className="flex-1">
                <p className="text-4xl font-black mb-1 leading-tight arabic-font" dir="rtl">{wordOfTheDay.arabic.split('(')[0]}</p>
                <p className="text-sm font-medium text-navy-light">{wordOfTheDay.bangla}</p>
              </div>
              <button 
                onClick={() => speak(wordOfTheDay.arabic)}
                className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-2xl flex items-center justify-center transition-all active:scale-90"
              >
                <Volume2 size={24} />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase bg-navy-light/20 text-navy-light px-2 py-0.5 rounded border border-navy-light/10">
              {wordOfTheDay.categoryTitle}
            </span>
            <button 
              onClick={() => navigate(`/category/${wordOfTheDay.categoryId}`)}
              className="text-[10px] font-black uppercase text-white/60 hover:text-white transition-colors"
            >
              আরও দেখুন →
            </button>
          </div>
        </div>
        <div className="absolute -right-10 -bottom-10 opacity-10 rotate-12">
          <Icons.Languages size={180} />
        </div>
      </div>

      {/* Difficulty Filters */}
      <div className="flex gap-2 p-1 bg-slate-200/50 rounded-2xl overflow-x-auto no-scrollbar">
        {['All', 'Beginner', 'Intermediate', 'Advanced'].map((diff) => (
          <button
            key={diff}
            onClick={() => setActiveDifficulty(diff as any)}
            className={cn(
              "px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all flex-1 whitespace-nowrap",
              activeDifficulty === diff 
                ? "bg-white text-navy-dark shadow-sm scale-[1.02]" 
                : "text-slate-500 hover:text-navy-dark"
            )}
          >
            {diff === 'All' ? 'সবগুলো' : diff === 'Beginner' ? 'মৌলিক' : diff === 'Intermediate' ? 'মধ্যম' : 'উন্নত'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredCategories.map((category, index) => {
            const IconComponent = (Icons as any)[category.icon] as LucideIcon || Icons.Book;
            
            return (
              <motion.div
                key={category.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                onClick={() => navigate(`/category/${category.id}`)}
                className="card-polish p-5 flex flex-col items-center text-center gap-4 cursor-pointer hover:bg-navy-light/40 transition-all active:scale-95 group relative overflow-hidden"
              >
              {/* Difficulty Level Indicator */}
              <div className="absolute top-2 left-2 z-10 opacity-70 group-hover:opacity-100 transition-opacity">
                <span className={cn(
                  "text-[8px] font-black px-2 py-0.5 rounded-full border uppercase tracking-wider shadow-sm",
                  category.difficulty === 'Beginner' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                  category.difficulty === 'Intermediate' ? "bg-blue-50 text-blue-600 border-blue-100" :
                  "bg-purple-50 text-purple-600 border-purple-100"
                )}>
                  {category.difficulty === 'Beginner' ? 'মৌলিক' : 
                   category.difficulty === 'Intermediate' ? 'মধ্যম' : 'উন্নত'}
                </span>
              </div>

              {/* Enhanced Icon Container */}
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                className="w-16 h-16 bg-navy-light text-navy-dark rounded-2xl flex items-center justify-center group-hover:bg-navy-dark group-hover:text-white transition-all duration-300 shadow-sm border border-navy/10"
              >
                <IconComponent size={32} strokeWidth={2.5} />
              </motion.div>
              
              <div className="space-y-1 text-center">
                <h3 className="font-bold text-ink text-sm sm:text-base tracking-tight group-hover:text-navy-dark transition-colors">{category.title}</h3>
                <div className="flex flex-col items-center gap-1.5">
                  <p className="text-[10px] uppercase font-extrabold text-ink-muted tracking-widest opacity-70">
                    {category.phrases.length} টি বাক্য
                  </p>
                  {/* Category Progress Bar */}
                  <div className="w-20 h-1 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${getCategoryProgress(category.id)}%` }}
                      className="h-full bg-emerald-500 rounded-full"
                    />
                  </div>
                </div>
              </div>

              {/* Decorative elements to reinforce clickability */}
              <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Icons.ArrowUpRight size={14} className="text-navy-dark" />
              </div>
              <div className="absolute left-0 top-0 w-1 h-full bg-navy-dark scale-y-0 group-hover:scale-y-100 transition-transform origin-bottom" />
            </motion.div>
          );
        })}
        </AnimatePresence>
      </div>

      <div className="p-5 card-polish border-l-4 border-l-navy-dark flex flex-col gap-2 bg-white/80 backdrop-blur-sm">
        <div className="flex justify-between items-center mb-1">
          <div className="flex items-center gap-2">
            <Icons.Trophy size={16} className="text-amber-500" />
            <span className="text-[11px] uppercase tracking-wider text-ink-muted font-bold">মোট অগ্রগতি</span>
          </div>
          <span className="text-xs font-bold text-navy-dark">{totalProgress}%</span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${totalProgress}%` }}
            className="h-full bg-navy-dark rounded-full shadow-[0_0_8px_rgba(26,35,126,0.2)]" 
          />
        </div>
      </div>
    </motion.div>
  );
}
