import React from 'react';
import { motion } from 'framer-motion';

export const LoadingScreen: React.FC<{ message?: string }> = ({ message = 'Loading NexPrep...' }) => {
  return (
    <div className="min-h-screen bg-[#FBFAFF] flex flex-col items-center justify-center p-6">
      <motion.div
        animate={{ scale: [1, 1.06, 1], opacity: [0.8, 1, 0.8] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        className="relative flex items-center justify-center mb-6"
      >
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-700 via-purple-600 to-pink-500 p-0.5 shadow-lg shadow-purple-200">
          <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center p-2.5">
            <img src="/logo.svg" alt="NexPrep" className="w-full h-full object-contain" />
          </div>
        </div>
        <div className="absolute -inset-2 rounded-2xl bg-purple-400/20 blur-xl -z-10 animate-pulse"></div>
      </motion.div>
      <h2 className="text-lg font-bold text-slate-800 tracking-tight">NexPrep Platform</h2>
      <p className="text-xs text-slate-500 mt-1 font-medium">{message}</p>
    </div>
  );
};
