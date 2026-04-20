import { motion } from 'motion/react';
import { Info, ShieldCheck, Download, WifiOff, Globe, Github, PhoneCall, ExternalLink } from 'lucide-react';

export function About() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="space-y-6 pb-10"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-navy-light text-navy-dark rounded-2xl flex items-center justify-center shadow-sm">
          <Info size={20} />
        </div>
        <h2 className="text-xl font-bold text-ink tracking-tight">অ্যাপের তথ্য</h2>
      </div>

      <div className="card-polish p-6 space-y-4">
        <h3 className="font-bold text-navy-dark border-b border-slate-100 pb-2">আমাদের সম্পর্কে</h3>
        <p className="text-sm text-slate-600 leading-relaxed">
          এই অ্যাপটি বিশেষভাবে তৈরি করা হয়েছে যারা সৌদি আরবে নতুন এসেছেন বা আসার পরিকল্পনা করছেন তাদের জন্য। বইয়ের কেতাবি আরবির বদলে এখানে সৌদি আরবের দৈনন্দিন "আঞ্চলিক" (Ammiya) কথোপকথনের ওপর গুরুত্ব দেওয়া হয়েছে।
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="card-polish p-4 flex gap-4 items-start">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
            <WifiOff size={20} />
          </div>
          <div>
            <h4 className="font-bold text-sm">সম্পূর্ণ অফলাইন</h4>
            <p className="text-xs text-slate-500 mt-1">একবার লোড হওয়ার পর ছাড়াই আজীবন কাজ করবে।</p>
          </div>
        </div>

        <div className="card-polish p-4 flex gap-4 items-start">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <Download size={20} />
          </div>
          <div>
            <h4 className="font-bold text-sm">PWA সাপোর্ট</h4>
            <p className="text-xs text-slate-500 mt-1">ব্রাউজার থেকে ইন্সটল করে সরাসরি অ্যাপ হিসেবে ব্যবহার করা যায়।</p>
          </div>
        </div>

        <div className="card-polish p-4 flex gap-4 items-start">
          <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h4 className="font-bold text-sm">প্রাইভেসি সুরক্ষিত</h4>
            <p className="text-xs text-slate-500 mt-1">আমরা আপনার কোনো ব্যক্তিগত তথ্য বা ডেটা সংগ্রহ করি না।</p>
          </div>
        </div>

        <a 
          href="https://zunaidhosse.github.io/My-contact/" 
          target="_blank" 
          rel="noreferrer"
          className="card-polish p-5 flex gap-4 items-center bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 text-white border-none hover:brightness-110 transition-all active:scale-[0.98] group shadow-xl shadow-orange-100"
        >
          <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md shadow-inner">
            <PhoneCall size={24} className="animate-bounce" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-lg tracking-tight">হেল্প লাইন</h4>
            <p className="text-[10px] opacity-80 uppercase font-black tracking-widest mt-0.5">কাস্টমার কেয়ার (২৪/৭ সাহায্য)</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
            <ExternalLink size={16} className="opacity-80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </a>
      </div>

      <div className="card-polish p-6 space-y-4 bg-navy-dark text-white border-none">
        <h3 className="font-bold border-b border-navy pb-2">কিভাবে ইন্সটল করবেন?</h3>
        <ul className="space-y-3 text-xs opacity-90">
          <li className="flex gap-2">
            <span className="bg-navy p-1 rounded h-fit">১</span>
            <span>প্রথমে আপনার ফোনের Chrome বা Safari ব্রাউজারে অ্যাপটি ওপেন করুন।</span>
          </li>
          <li className="flex gap-2">
            <span className="bg-navy p-1 rounded h-fit">২</span>
            <span>ব্রাউজার মেনু থেকে <span className="font-bold">"Add to Home Screen"</span> বাটনে ক্লিক করুন।</span>
          </li>
          <li className="flex gap-2">
            <span className="bg-navy p-1 rounded h-fit">৩</span>
            <span>অ্যাপটি আপনার ফোনের হোম স্ক্রিনে আইকন হিসেবে জমা হবে।</span>
          </li>
        </ul>
      </div>

      <div className="flex flex-col items-center gap-2 py-4">
        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">সংস্করণ ১.০.০</p>
        <div className="flex gap-4">
          <button className="p-2 text-slate-400 hover:text-navy transition-colors">
            <Globe size={18} />
          </button>
          <button className="p-2 text-slate-400 hover:text-navy transition-colors">
            <Github size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
