import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Info, ShieldCheck, Download, WifiOff, Globe, Github, PhoneCall, ExternalLink, Share2, X } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export function About() {
  const [showQR, setShowQR] = useState(false);
  const appUrl = "https://zunaidhosse.github.io/arbi-shikkha/";

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

        <div className="space-y-3">
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

          <button 
            onClick={() => setShowQR(true)}
            className="w-full card-polish p-5 flex gap-4 items-center bg-white border-2 border-slate-100 hover:border-navy-dark transition-all active:scale-[0.98] group shadow-sm"
          >
            <div className="p-3 bg-navy-light text-navy-dark rounded-2xl group-hover:scale-110 transition-transform">
              <Share2 size={24} />
            </div>
            <div className="flex-1 text-left">
              <h4 className="font-bold text-lg tracking-tight text-navy-dark">শেয়ার করুন</h4>
              <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-0.5">বন্ধু ও পরিবারের সাথে অ্যাপটি শেয়ার করুন</p>
            </div>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showQR && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-navy-dark/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl p-8 max-w-xs w-full shadow-2xl relative flex flex-col items-center text-center"
            >
              <button 
                onClick={() => setShowQR(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-navy-dark transition-colors"
              >
                <X size={20} />
              </button>
              
              <h3 className="text-xl font-black text-navy-dark mb-2">QR কোড স্ক্যান করুন</h3>
              <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                আপনার বন্ধুর ফোন দিয়ে এই কোডটি স্ক্যান করলে সরাসরি অ্যাপটি ওপেন হবে।
              </p>

              <div className="p-4 bg-slate-50 rounded-2xl border-2 border-slate-100 mb-6">
                <QRCodeSVG 
                  value={appUrl} 
                  size={180}
                  level="H"
                  includeMargin={true}
                />
              </div>

              <div className="w-full space-y-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">লিঙ্ক কপি করুন</p>
                <div className="bg-slate-100 p-3 rounded-xl flex items-center justify-between gap-3 border border-slate-200">
                  <span className="text-[10px] font-mono text-slate-600 truncate flex-1">{appUrl}</span>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(appUrl);
                      alert("লিঙ্ক কপি করা হয়েছে!");
                    }}
                    className="p-1.5 bg-white text-navy-dark rounded-lg shadow-sm active:scale-90 transition-transform"
                  >
                    <ExternalLink size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
