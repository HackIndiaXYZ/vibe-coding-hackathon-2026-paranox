import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Zap } from "lucide-react";

interface BootOverlayProps {
  onComplete: () => void;
  key?: string;
}

export default function BootOverlay({ onComplete }: BootOverlayProps) {
  const [bootStep, setBootStep] = useState(0);
  const [showOverlay, setShowOverlay] = useState(true);

  const bootMessages = [
    "Establishing secure connection to advisory network...",
    "Loading BizForge Simulation Engine v2.04...",
    "Synchronizing regional market models...",
    "Calibrating real-time growth analytics...",
    "Verifying founder credentials...",
    "Initializing autonomous advisory board...",
    "System ready for strategic deployment."
  ];

  useEffect(() => {
    // Stage messages every 400ms
    const interval = setInterval(() => {
      setBootStep((prev) => {
        if (prev < bootMessages.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          return prev;
        }
      });
    }, 450);

    // Fade out overlay after 3.5 seconds
    const timeout = setTimeout(() => {
      setShowOverlay(false);
      setTimeout(onComplete, 800);
    }, 3500);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {showOverlay && (
        <motion.div
          id="bootOverlay"
          className="fixed inset-0 bg-[#050505] z-[100] flex flex-col items-center justify-center select-none"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Subtle background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#ff7a00]/5 blur-[100px] rounded-full"></div>

          <div className="w-full max-w-sm px-8 flex flex-col items-center text-center space-y-10 relative">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#ff7a00] to-[#ff9a33] flex items-center justify-center shadow-2xl shadow-[#ff7a00]/20"
            >
              <Zap className="w-8 h-8 text-black fill-black" />
            </motion.div>

            <div className="space-y-6 w-full">
              <div className="space-y-2">
                <h2 className="text-white text-lg font-bold tracking-tight">BizForge</h2>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-[#ff7a00]"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 3.2, ease: "easeInOut" }}
                  />
                </div>
              </div>

              <div className="h-4 overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={bootStep}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="text-[12px] font-medium text-neutral-400 uppercase tracking-widest"
                  >
                    {bootMessages[bootStep]}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>

            <div className="text-[10px] font-medium text-neutral-600 tracking-tight">
              © 2026 BIZFORGE SIMULATION PLATFORM
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
