import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, X, Laptop, Smartphone } from 'lucide-react';

export function InstallPWA() {
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if app is already installed/running in standalone mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
    
    if (isStandalone) {
      return;
    }

    // Check if it's iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIOSDevice);

    // Listen for the beforeinstallprompt event (Android/Chrome)
    const handler = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
      
      // Only show if user hasn't dismissed it in this session
      const dismissed = sessionStorage.getItem('pwa-prompt-dismissed');
      if (!dismissed) {
        setIsVisible(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    // For iOS, show the prompt manually after a short delay since beforeinstallprompt isn't supported
    if (isIOSDevice) {
      const dismissed = sessionStorage.getItem('pwa-prompt-dismissed');
      if (!dismissed) {
        const timer = setTimeout(() => setIsVisible(true), 3000);
        return () => clearTimeout(timer);
      }
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt && !isIOS) return;

    if (isIOS) {
      // For iOS, we just show instructions (modal stays open with instructions)
      return;
    }

    // Show the native browser prompt
    installPrompt.prompt();
    
    const { outcome } = await installPrompt.userChoice;
    console.log(`User response to install prompt: ${outcome}`);
    
    setInstallPrompt(null);
    setIsVisible(false);
  };

  const dismissPrompt = () => {
    setIsVisible(false);
    sessionStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4 bg-navy-dark/40 backdrop-blur-[2px]">
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden border border-slate-100"
          >
            <div className="relative p-6 pt-8 text-center">
              <button 
                onClick={dismissPrompt}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-navy-dark transition-colors"
                id="close-install-prompt"
              >
                <X size={20} />
              </button>

              <div className="w-16 h-16 bg-navy text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-navy/20">
                <Download size={32} />
              </div>

              <h3 className="text-xl font-black text-navy-dark mb-2">অ্যাপটি ইন্সটল করুন</h3>
              <p className="text-sm text-slate-500 mb-6 px-4">
                সহজে এবং দ্রুত অফলাইনে ব্যবহারের জন্য অ্যাপটি আপনার ফোনে ইন্সটল করে নিন।
              </p>

              {isIOS ? (
                <div className="bg-slate-50 rounded-2xl p-4 text-left space-y-3 mb-6">
                  <p className="text-xs font-bold text-navy-dark flex items-center gap-2">
                    <Smartphone size={16} /> iPhone ব্যবহারকারীদের জন্য:
                  </p>
                  <ol className="text-[11px] text-slate-600 space-y-2 list-decimal ml-4">
                    <li>নিচের <b>Share</b> বাটনে ক্লিক করুন।</li>
                    <li>নিচের দিকে স্ক্রল করে <b>'Add to Home Screen'</b> অপশনটি বেছে নিন।</li>
                    <li>উপরে <b>'Add'</b> ক্লিক করুন।</li>
                  </ol>
                </div>
              ) : (
                <div className="flex flex-col gap-3 mb-2">
                  <button 
                    onClick={handleInstallClick}
                    className="w-full py-4 bg-navy text-white rounded-2xl font-black text-sm shadow-lg shadow-navy/20 hover:bg-slate-800 transition-all active:scale-[0.98]"
                    id="install-pwa-button"
                  >
                    ইন্সটল করুন
                  </button>
                  <button 
                    onClick={dismissPrompt}
                    className="w-full py-3 text-slate-400 font-bold text-xs hover:text-slate-600 transition-colors"
                  >
                    পরে করব
                  </button>
                </div>
              )}

              <div className="flex items-center justify-center gap-4 pt-2 border-t border-slate-50 mt-4 opacity-40">
                <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                  <Laptop size={12} /> Desktop
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                  <Smartphone size={12} /> Mobile
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
