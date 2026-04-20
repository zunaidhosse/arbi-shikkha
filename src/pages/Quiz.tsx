import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { saudiData } from '@/src/data/lessons';
import { ArrowLeft, Check, X, Trophy, RefreshCcw, BookOpen } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { updateActivity } from '@/src/lib/progress';

export function Quiz() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const quizData = useMemo(() => {
    let sourcePhrases = [];
    if (categoryId) {
      const cat = saudiData.categories.find(c => c.id === categoryId);
      sourcePhrases = cat ? cat.phrases : [];
    } else {
      sourcePhrases = saudiData.categories.flatMap(cat => cat.phrases);
    }

    // Shuffle and pick 10 questions
    const shuffled = [...sourcePhrases].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 10);

    return selected.map(phrase => {
      // 50/50 chance for Arabic to Bengali or vice versa
      const type = Math.random() > 0.5 ? 'ar-bn' : 'bn-ar';
      
      // Get 3 wrong answers
      const others = sourcePhrases
        .filter(p => p.id !== phrase.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      
      const options = [...others, phrase].sort(() => 0.5 - Math.random());
      
      return {
        question: type === 'ar-bn' ? phrase.arabic : phrase.bangla,
        answer: type === 'ar-bn' ? phrase.bangla : phrase.arabic,
        options: type === 'ar-bn' ? options.map(o => o.bangla) : options.map(o => o.arabic),
        type
      };
    });
  }, [categoryId]);

  if (quizData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-10 text-center gap-4">
        <BookOpen size={48} className="text-slate-300" />
        <h3 className="text-xl font-bold text-navy-dark">দুঃখিত, কোনো প্রশ্ন পাওয়া যায়নি।</h3>
        <Link to="/" className="text-navy transition-colors hover:underline">হোমে ফিরে যান</Link>
      </div>
    );
  }

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(index);
    const correct = quizData[currentStep].options[index] === quizData[currentStep].answer;
    setIsCorrect(correct);
    if (correct) setScore(prev => prev + 1);

    setTimeout(() => {
      if (currentStep < quizData.length - 1) {
        setCurrentStep(prev => prev + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
      } else {
        setIsFinished(true);
        updateActivity();
      }
    }, 1500);
  };

  if (isFinished) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center p-6 text-center gap-8 h-full"
      >
        <div className="relative">
          <div className="w-48 h-48 bg-amber-100 rounded-full flex items-center justify-center shadow-xl">
            <Trophy size={80} className="text-amber-500" />
          </div>
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-4 rounded-full shadow-lg"
          >
            <Check size={32} />
          </motion.div>
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl font-black text-navy-dark">চমৎকার!</h2>
          <p className="text-ink-muted">আপনার কুইজ সম্পন্ন হয়েছে</p>
          <p className="text-5xl font-black text-navy-dark mt-4">
            {score} <span className="text-xl text-slate-400 font-bold">/ {quizData.length}</span>
          </p>
        </div>

        <div className="flex gap-4 w-full max-w-sm">
          <button 
            onClick={() => window.location.reload()}
            className="flex-1 p-4 bg-navy-dark text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform"
          >
            <RefreshCcw size={20} />
            আবার চেষ্টা করুন
          </button>
          <button 
            onClick={() => navigate('/')}
            className="flex-1 p-4 bg-slate-100 text-navy-dark rounded-2xl font-bold shadow-sm active:scale-95 transition-transform"
          >
            হোম
          </button>
        </div>
      </motion.div>
    );
  }

  const currentQuestion = quizData[currentStep];
  const progressPercent = ((currentStep) / quizData.length) * 100;

  return (
    <div className="flex flex-col h-full gap-8">
      {/* Quiz Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft size={20} className="text-navy-dark" />
          </button>
          <div className="flex-1 text-center">
            <h2 className="text-lg font-black text-navy-dark uppercase tracking-wide">কুইজ মোড</h2>
          </div>
          <div className="w-10" /> {/* Spacer */}
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            className="h-full bg-navy-dark shadow-sm"
          />
        </div>
        <p className="text-center font-bold text-xs text-ink-muted uppercase tracking-widest">
           প্রশ্ন {currentStep + 1} / {quizData.length}
        </p>
      </div>

      {/* Question Card */}
      <motion.div 
        key={currentStep}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        className="flex-1 flex flex-col justify-center gap-8"
      >
        <div className="p-8 bg-white rounded-3xl shadow-xl shadow-navy/5 border border-navy/5 text-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
             <BookOpen size={120} />
          </div>
          <span className="text-[10px] font-black uppercase text-navy-dark/40 tracking-widest mb-2 block">সঠিক উত্তর নির্বাচন করুন</span>
          <h3 className={cn(
            "text-3xl font-black leading-tight",
            currentQuestion.type === 'ar-bn' ? "arabic-font" : "text-navy-dark"
          )}>
            {currentQuestion.question}
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedAnswer === idx;
            const isAnswerCorrect = option === currentQuestion.answer;
            
            return (
              <motion.button
                key={idx}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAnswer(idx)}
                className={cn(
                  "p-4 rounded-2xl text-left font-bold transition-all border-2",
                  selectedAnswer === null 
                    ? "bg-white border-slate-100 hover:border-navy hover:bg-slate-50" 
                    : isSelected 
                      ? isCorrect 
                        ? "bg-emerald-50 border-emerald-500 text-emerald-700" 
                        : "bg-rose-50 border-rose-500 text-rose-700"
                      : isAnswerCorrect 
                        ? "bg-emerald-50 border-emerald-500 text-emerald-700"
                        : "bg-white border-slate-100 opacity-50"
                )}
              >
                <div className="flex items-center justify-between">
                  <span className={cn(
                    "text-sm",
                    currentQuestion.type === 'bn-ar' ? "text-lg arabic-font" : ""
                  )}>{option}</span>
                  {selectedAnswer !== null && (
                    isSelected ? (
                      isCorrect ? <Check size={18} /> : <X size={18} />
                    ) : (
                      isAnswerCorrect ? <Check size={18} /> : null
                    )
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
