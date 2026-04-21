import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Bookmark, Info, Search } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { motion } from 'motion/react';
import { useProgress } from '@/src/lib/progress';
import { saudiData } from '@/src/data/lessons';
import { SearchOverlay } from './SearchOverlay';

export function Layout({ children }: { children: React.ReactNode }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { getTotalProgress, getCategoryProgress } = useProgress();
  const totalProgress = getTotalProgress();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      
      {/* Header */}
      <header className="header-polish p-4 sticky top-0 z-50">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold tracking-tight">আরবি শিক্ষা (PWA)</h1>
            <span className="bg-offline text-white px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 shadow-sm">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              অফলাইন
            </span>
          </div>
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="p-2 bg-navy rounded-full hover:bg-slate-700 transition-colors shadow-inner"
          >
            <Search size={18} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-2xl mx-auto w-full p-4 pb-24">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-[0_-2px_15px_rgba(0,0,0,0.08)] z-50">
        {/* Category Progress Strip */}
        <div className="flex w-full h-[3px] bg-slate-100 gap-[2px] px-1">
          {saudiData.categories.map((cat) => (
            <div key={cat.id} className="flex-1 h-full bg-slate-200/50 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${getCategoryProgress(cat.id)}%` }}
                className={cn(
                  "h-full transition-colors duration-500",
                  cat.difficulty === 'Beginner' ? "bg-emerald-400" : 
                  cat.difficulty === 'Intermediate' ? "bg-blue-400" : "bg-purple-400"
                )}
              />
            </div>
          ))}
        </div>

        <div className="max-w-xl mx-auto flex justify-around relative px-2 py-1.5">
          <NavLink 
            to="/" 
            className="group relative flex flex-col items-center p-3 z-10 transition-transform active:scale-90"
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute inset-0 bg-navy-light/60 rounded-2xl -z-10 shadow-sm border border-navy/5"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <motion.div 
                  animate={{ 
                    y: isActive ? -4 : 0, 
                    scale: isActive ? 1.2 : 1,
                    rotate: isActive ? [0, -10, 10, 0] : 0
                  }}
                  transition={{ rotate: { duration: 0.4 } }}
                  className={cn(
                    "relative transition-all duration-300",
                    isActive ? "text-navy-dark" : "text-slate-400"
                  )}
                >
                  <Home size={22} className={cn(isActive && "drop-shadow-md")} />
                  {isActive && (
                    <motion.div 
                      layoutId="activeDot"
                      className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white shadow-sm"
                    />
                  )}
                </motion.div>
                <motion.span 
                  animate={{ opacity: isActive ? 1 : 0.6, scale: isActive ? 1.05 : 0.9 }}
                  className={cn(
                    "text-[10px] mt-1 uppercase tracking-tighter sm:tracking-wider font-black transition-colors",
                    isActive ? "text-navy-dark" : "text-slate-400"
                  )}
                >হোম</motion.span>
              </>
            )}
          </NavLink>
          
          <NavLink 
            to="/favorites" 
            className="group relative flex flex-col items-center p-3 z-10 transition-transform active:scale-90"
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute inset-0 bg-navy-light/60 rounded-2xl -z-10 shadow-sm border border-navy/5"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <motion.div 
                  animate={{ 
                    y: isActive ? -4 : 0, 
                    scale: isActive ? 1.2 : 1,
                    rotate: isActive ? [0, 10, -10, 0] : 0
                  }}
                  transition={{ rotate: { duration: 0.4 } }}
                  className={cn(
                    "relative transition-all duration-300",
                    isActive ? "text-navy-dark" : "text-slate-400"
                  )}
                >
                  <Bookmark size={22} className={cn(isActive && "drop-shadow-md")} />
                  {isActive && (
                    <motion.div 
                      layoutId="activeDot"
                      className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white shadow-sm"
                    />
                  )}
                </motion.div>
                <motion.span 
                  animate={{ opacity: isActive ? 1 : 0.6, scale: isActive ? 1.05 : 0.9 }}
                  className={cn(
                    "text-[10px] mt-1 uppercase tracking-tighter sm:tracking-wider font-black transition-colors",
                    isActive ? "text-navy-dark" : "text-slate-400"
                  )}
                >প্রিয়</motion.span>
              </>
            )}
          </NavLink>

          <NavLink 
            to="/about" 
            className="group relative flex flex-col items-center p-3 z-10 transition-transform active:scale-90"
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute inset-0 bg-navy-light/60 rounded-2xl -z-10 shadow-sm border border-navy/5"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <motion.div 
                  animate={{ 
                    y: isActive ? -4 : 0, 
                    scale: isActive ? 1.2 : 1,
                    rotate: isActive ? [0, -5, 5, 0] : 0
                  }}
                  transition={{ rotate: { duration: 0.4 } }}
                  className={cn(
                    "relative transition-all duration-300",
                    isActive ? "text-navy-dark" : "text-slate-400"
                  )}
                >
                  <Info size={22} className={cn(isActive && "drop-shadow-md")} />
                  {isActive && (
                    <motion.div 
                      layoutId="activeDot"
                      className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white shadow-sm"
                    />
                  )}
                </motion.div>
                <motion.span 
                  animate={{ opacity: isActive ? 1 : 0.6, scale: isActive ? 1.05 : 0.9 }}
                  className={cn(
                    "text-[10px] mt-1 uppercase tracking-tighter sm:tracking-wider font-black transition-colors",
                    isActive ? "text-navy-dark" : "text-slate-400"
                  )}
                >তথ্য</motion.span>
              </>
            )}
          </NavLink>
        </div>
      </nav>
    </div>
  );
}
