import React from 'react';
import { Scan, Fingerprint, Globe, ChevronRight, BrainCircuit, Search, Layers } from 'lucide-react';
import { motion } from 'framer-motion';

interface LandingPageProps {
  onEnter: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
      transition={{ duration: 0.8 }}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden text-gray-900 dark:text-gray-100 transition-colors duration-300"
    >
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0">
         <img 
           src="https://v3b.fal.media/files/b/0a860799/RMd9CQWZ2oMfMeXF7C1Sp.jpg" 
           alt="Background" 
           className="w-full h-full object-cover"
         />
         <div className="absolute inset-0 bg-white/90 dark:bg-black/85 transition-colors duration-300" />
      </div>

      {/* Background Effects */}
      <div className="absolute inset-0 cyber-grid opacity-5 dark:opacity-30 pointer-events-none"></div>
      <div className="scanline opacity-10 dark:opacity-50 pointer-events-none"></div>
      
      {/* Decorative Orbs */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" 
      />
      <motion.div 
        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" 
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        
        {/* Main Title Area with Stamps */}
        <div className="relative inline-block mb-6 group cursor-default mx-12 md:mx-24 mt-12">
          
          {/* FOUND STAMP - ROUND - LEFT (Swapped & Prominent) */}
           <motion.div 
             initial={{ scale: 3, opacity: 0, rotate: -30 }}
             animate={{ scale: 1, opacity: 1, rotate: -12 }}
             transition={{ 
               type: "spring",
               stiffness: 300,
               damping: 15,
               delay: 0.8
             }}
             className="absolute -top-10 -left-12 md:-left-32 z-30 pointer-events-none select-none"
           >
             <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-[4px] md:border-[6px] border-green-500 flex items-center justify-center bg-green-500/20 shadow-[0_0_40px_rgba(34,197,94,0.6)] backdrop-blur-sm mix-blend-screen animate-pulse">
                <div className="w-[90%] h-[90%] rounded-full border-[2px] border-green-500/60 flex items-center justify-center">
                   <div className="text-green-600 dark:text-green-400 font-black text-xs md:text-lg tracking-widest uppercase transform -rotate-6 text-center leading-none drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]">
                     MATCH<br/>FOUND
                   </div>
                </div>
             </div>
          </motion.div>

          <motion.h1 
            initial={{ scale: 0.9, opacity: 0, filter: "blur(10px)" }}
            animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-6xl md:text-9xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-gray-900 to-gray-400 dark:from-white dark:to-white/10 glitch-text relative z-10"
          >
            Reunite.ai
          </motion.h1>
          
          {/* Powered By Badge - Relocated */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="absolute -bottom-8 right-0 md:right-2 flex items-center gap-2 z-40"
          >
             <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-mono tracking-widest">Powered by</span>
             <div className="flex items-center gap-0.5">
               <img src="https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg" alt="Gemini" className="h-5 w-auto dark:brightness-0 dark:invert opacity-90" />
               <span className="text-xl font-bold text-gray-600 dark:text-gray-300 leading-none relative top-[1px]">3</span>
             </div>
          </motion.div>

          {/* MISSING STAMP - ROUND - RIGHT (Swapped & Faded) */}
          <motion.div 
            initial={{ scale: 2, opacity: 0, rotate: 20 }}
            animate={{ scale: 1, opacity: 0.4, rotate: 6 }}
            transition={{ 
               type: "spring",
               stiffness: 200,
               damping: 20,
               delay: 0.5 
             }}
            className="absolute -bottom-2 -right-10 md:-right-24 z-20 pointer-events-none select-none mix-blend-overlay grayscale-[0.5]"
          >
             <div className="w-16 h-16 md:w-24 md:h-24 rounded-full border-[2px] md:border-[3px] border-red-500/60 flex items-center justify-center bg-red-500/5">
               <div className="w-[90%] h-[90%] rounded-full border border-red-500/30 flex items-center justify-center">
                 <div className="text-red-500/60 font-black text-[8px] md:text-xs tracking-widest uppercase transform rotate-6 text-center leading-none decoration-red-500/50 line-through decoration-2">
                   MISSING<br/>PERSON
                 </div>
               </div>
             </div>
          </motion.div>
        </div>

        <motion.p 
          initial={{ opacity: 0, letterSpacing: "0em" }}
          animate={{ opacity: 0.7, letterSpacing: "0.1em" }}
          transition={{ duration: 1, delay: 1 }}
          className="text-xl md:text-2xl text-cyan-800 dark:text-cyan-100 font-light tracking-widest uppercase mb-16 mt-12"
        >
          AI-Driven Missing Person Identification & Recovery
        </motion.p>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 max-w-5xl mx-auto">
          {[
            { Icon: BrainCircuit, title: "Forensic Reasoning", desc: "Gemini 3 uses deep thinking to analyze how specific missing scenarios (e.g. homelessness) physically alter appearance over time." },
            { Icon: Layers, title: "Multi-Scenario Simulation", desc: "Generates variations for different probable life paths, moving beyond standard linear age progression." },
            { Icon: Search, title: "Visual Identification", desc: "Produces high-fidelity, photorealistic reconstructions to maximize the chance of public recognition." }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.2 + (i * 0.2) }}
              className="bg-white/40 dark:bg-black/40 backdrop-blur-md border border-gray-200 dark:border-white/10 p-6 rounded-sm hover:border-cyan-500/50 transition-colors group shadow-sm dark:shadow-none"
            >
              <feature.Icon className="w-8 h-8 text-cyan-600 dark:text-cyan-400 mb-4 mx-auto group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA Button */}
        <motion.button 
          onClick={onEnter}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="group relative px-8 py-4 bg-transparent overflow-hidden rounded-sm transition-all"
        >
          <div className="absolute inset-0 w-full h-full bg-cyan-500/10 border border-cyan-600/50 dark:border-cyan-500/50 group-hover:bg-cyan-500/20 transition-all"></div>
          <div className="absolute bottom-0 left-0 h-[2px] w-full bg-cyan-600 dark:bg-cyan-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
          <div className="relative flex items-center justify-center gap-3 text-cyan-800 dark:text-cyan-100 font-mono tracking-widest text-lg">
            INITIALIZE SYSTEM <ChevronRight className="w-5 h-5 animate-bounce-x" />
          </div>
        </motion.button>
      </div>

      {/* Footer Data */}
      <div className="absolute bottom-6 w-full px-12 flex justify-between text-[10px] text-gray-400 dark:text-white/20 font-mono uppercase">
        <div>Server: US-CENTRAL-1</div>
        <div className="hidden md:block">Latency: 12ms</div>
        <div>Gemini Pro Protocol: Active</div>
      </div>
    </motion.div>
  );
};

export default LandingPage;