import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { saudiData } from '@/src/data/lessons';
import * as Icons from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { useProgress } from '@/src/lib/progress';
import { cn } from '@/src/lib/utils';

export function Home() {
  const navigate = useNavigate();
  const { getTotalProgress, getCategoryProgress } = useProgress();
  const totalProgress = getTotalProgress();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="bg-navy-dark p-6 rounded-2xl text-white shadow-lg overflow-hidden relative border border-navy">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold tracking-tight mb-2">আসসালামু আলাইকুম!</h2>
          <p className="text-navy-light text-sm opacity-90 font-medium">সৌদি আরবের আঞ্চলিক আরবি শিখুন সহজে এবং অফলাইনে।</p>
        </div>
        <div className="absolute -right-4 -bottom-4 opacity-5">
          <Icons.Languages size={150} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {saudiData.categories.map((category, index) => {
          const IconComponent = (Icons as any)[category.icon] as LucideIcon || Icons.Book;
          
          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
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
