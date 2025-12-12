import React, { useState, useRef, useEffect } from 'react';
import { Upload, MapPin, User, Search, AlertCircle, Play, Database, FileText, Download, Terminal, ChevronRight, Clock, Layers, Plus, PersonStanding } from 'lucide-react';
import { generatePredictionStream, PredictionResultItem } from '../services/geminiService';
import { motion, AnimatePresence } from 'framer-motion';

const GENDERS = ["Male", "Female", "Non-Binary", "Other", "Unspecified"];

const SCENARIOS = [
  "AI Optimized Analysis (Auto-Detect Best Fit)",
  "Homelessness / Urban Survival (Rough Sleeper)",
  "Severe Memory Loss / Amnesia (Unaware of Past)",
  "Human Trafficking / Forced Labor Context",
  "Voluntary Disappearance / New Identity (Pseudocide)",
  "Fugitive / Evasion of Justice",
  "Mental Health Crisis / Wandering / Untreated",
  "Rural / Off-grid Living (Exposure to elements)",
  "Lost / Wilderness Survival (Disoriented)",
  "Long-term Abduction / Captivity",
  "Substance Abuse Impact / Physical Deterioration",
  "Institutionalized (State Care / Hospital / Prison)",
  "Cult / Sect Affiliation (Specific grooming/attire)",
  "Natural Aging (Standard Control Group)",
  "Natural Aging / Metabolic Change (Weight Gain)"
];

const Dashboard: React.FC = () => {
  // Input State
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [gender, setGender] = useState(GENDERS[0]);
  const [ageAtMissing, setAgeAtMissing] = useState("");
  const [yearsMissing, setYearsMissing] = useState("");
  const [location, setLocation] = useState("");
  const [scenario, setScenario] = useState(SCENARIOS[0]);
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [variationCount, setVariationCount] = useState<number>(2);

  // Processing State
  const [isProcessing, setIsProcessing] = useState(false);
  const [terminalLog, setTerminalLog] = useState<string[]>([]);
  
  // Results State
  const [results, setResults] = useState<PredictionResultItem[]>([]);
  const [selectedResultId, setSelectedResultId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logs
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [terminalLog]);

  // Select the new image automatically if it's the first one
  useEffect(() => {
    if (results.length > 0 && !selectedResultId) {
      setSelectedResultId(results[0].id);
    }
  }, [results, selectedResultId]);

  const addLog = (text: string) => {
    setTerminalLog(prev => [...prev, `[${new Date().toLocaleTimeString().split(' ')[0]}] ${text}`]);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
      addLog(`Image loaded: ${file.name}`);
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove data url prefix for API
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  };

  const getSelectedResult = () => results.find(r => r.id === selectedResultId);

  const handleDownload = () => {
    const current = getSelectedResult();
    if (current) {
      const link = document.createElement('a');
      link.href = current.image;
      link.download = `Reunite.ai_${name.replace(/\s+/g, '_')}_${current.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleGenerate = async (isAppend: boolean = false) => {
    if (!selectedImage || !ageAtMissing || !yearsMissing) {
      setError("Missing critical data (Image, Age, or Years Missing).");
      return;
    }

    setIsProcessing(true);
    setError(null);
    if (!isAppend) {
      setResults([]);
      setSelectedResultId(null);
      setTerminalLog([]);
    }

    try {
      addLog(isAppend ? "GENERATING ADDITIONAL VARIATIONS..." : "INITIALIZING NEURAL CORE...");
      
      const base64 = await convertFileToBase64(selectedImage);
      
      addLog("ANALYZING TEMPORAL DATA...");
      addLog(`SUBJECT: ${gender.toUpperCase()} | AGE LOST: ${ageAtMissing}`);
      
      if (scenario.includes("AI Optimized")) {
        addLog("AI MODE: CALCULATING SCENARIO PROBABILITIES...");
      } else {
        addLog(`LOCKED SCENARIO: ${scenario.split('(')[0].toUpperCase()}`);
      }

      await generatePredictionStream({
        referenceImageBase64: base64,
        name,
        gender,
        ageAtMissing: parseInt(ageAtMissing),
        yearsMissing: parseInt(yearsMissing),
        location,
        scenario,
        additionalDetails,
        variationCount
      }, (newItem) => {
        setResults(prev => [...prev, newItem]);
        if (!isAppend && results.length === 0) {
            // First item arrived
            addLog("DATA STREAM ESTABLISHED.");
        }
      });

      addLog("BATCH COMPLETE.");

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Prediction failed.");
      addLog("CRITICAL FAILURE: PROCESS ABORTED");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="h-screen bg-white dark:bg-black text-gray-800 dark:text-gray-200 font-mono flex overflow-hidden relative transition-colors duration-300"
    >
      {/* Background Grid */}
      <div className="absolute inset-0 cyber-grid opacity-30 dark:opacity-20 pointer-events-none z-0"></div>

      {/* --- LEFT PANEL: Inputs --- */}
      <motion.div 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full md:w-[300px] lg:w-[350px] flex-shrink-0 border-r border-gray-200 dark:border-white/10 bg-white/80 dark:bg-black/80 backdrop-blur-xl z-20 flex flex-col h-full shadow-xl dark:shadow-none"
      >
        <div className="p-5 border-b border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-black/40 flex justify-between items-center">
          <h2 className="text-cyan-600 dark:text-cyan-400 font-bold tracking-widest flex items-center gap-2 text-sm">
            <Database className="w-4 h-4" />
            SUBJECT DATA
          </h2>
          <span className="text-[10px] text-cyan-600/50 dark:text-cyan-500/50 font-mono tracking-widest border border-cyan-600/20 dark:border-cyan-500/20 px-1.5 py-0.5 rounded-sm">SYS.V.3.0.0</span>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
          
          {/* Image Input */}
          <div className="space-y-2">
            <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Original Reference</label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="relative h-[17rem] w-full rounded-lg border border-dashed border-gray-300 dark:border-white/20 hover:border-cyan-500/50 transition-colors cursor-pointer flex flex-col items-center justify-center bg-gray-50 dark:bg-white/5 overflow-hidden group"
            >
              {imagePreview ? (
                <>
                  <motion.img 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="text-xs text-cyan-400 font-bold tracking-widest">CHANGE SOURCE</span>
                  </div>
                </>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-gray-400 mb-2 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors" />
                  <span className="text-[10px] text-gray-500 tracking-widest">UPLOAD REFERENCE</span>
                </>
              )}
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
              className="hidden" 
              accept="image/*"
            />
          </div>

          {/* Form Fields */}
          <motion.div 
            className="space-y-4"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { 
                opacity: 1,
                transition: { staggerChildren: 0.1 }
              }
            }}
          >
            {/* Name and Gender */}
            <motion.div className="grid grid-cols-2 gap-3" variants={{ hidden: { x: -20, opacity: 0 }, visible: { x: 0, opacity: 1 } }}>
               <div>
                  <label className="text-[10px] text-gray-500 uppercase mb-1 block font-bold">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-3 top-2.5 w-3.5 h-3.5 text-gray-400" />
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-white dark:bg-black border border-gray-200 dark:border-white/10 rounded-sm pl-9 pr-2 py-2 text-xs focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/20 text-gray-900 dark:text-gray-200"
                      placeholder="John Doe"
                    />
                  </div>
               </div>
               <div>
                 <label className="text-[10px] text-gray-500 uppercase mb-1 block font-bold">Gender</label>
                  <div className="relative">
                    <PersonStanding className="absolute left-3 top-2.5 w-3.5 h-3.5 text-gray-400" />
                    <select 
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full bg-white dark:bg-black border border-gray-200 dark:border-white/10 rounded-sm pl-9 pr-3 py-2 text-xs focus:border-cyan-500/50 focus:outline-none appearance-none text-gray-800 dark:text-gray-300"
                    >
                      {GENDERS.map(g => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-2.5 pointer-events-none text-gray-500">
                      <ChevronRight className="w-3 h-3 rotate-90" />
                    </div>
                  </div>
               </div>
            </motion.div>

            <motion.div variants={{ hidden: { x: -20, opacity: 0 }, visible: { x: 0, opacity: 1 } }}>
                <label className="text-[10px] text-gray-500 uppercase mb-1 block font-bold">Last Known Location</label>
                <div className="relative group">
                  <MapPin className="absolute left-3 top-2.5 w-3.5 h-3.5 text-gray-400 group-focus-within:text-cyan-600 dark:group-focus-within:text-cyan-500 transition-colors" />
                  <input 
                    type="text" 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-white dark:bg-black border border-gray-200 dark:border-white/10 rounded-sm pl-9 pr-3 py-2 text-xs focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/20 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-700 text-gray-900 dark:text-gray-200"
                    placeholder="City, Country"
                  />
                </div>
            </motion.div>

            <motion.div className="grid grid-cols-2 gap-3" variants={{ hidden: { x: -20, opacity: 0 }, visible: { x: 0, opacity: 1 } }}>
              <div>
                <label className="text-[10px] text-gray-500 uppercase mb-1 block font-bold">Age When Lost</label>
                <div className="relative group">
                  <User className="absolute left-3 top-2.5 w-3.5 h-3.5 text-gray-400" />
                  <input 
                    type="number" 
                    value={ageAtMissing}
                    onChange={(e) => setAgeAtMissing(e.target.value)}
                    className="w-full bg-white dark:bg-black border border-gray-200 dark:border-white/10 rounded-sm pl-9 pr-2 py-2 text-xs focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/20 text-gray-900 dark:text-gray-200"
                    placeholder="e.g. 25"
                    min="0"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] text-gray-500 uppercase mb-1 block font-bold">Years Missing</label>
                <div className="relative group">
                  <Clock className="absolute left-3 top-2.5 w-3.5 h-3.5 text-gray-400" />
                  <input 
                    type="number" 
                    value={yearsMissing}
                    onChange={(e) => setYearsMissing(e.target.value)}
                    className="w-full bg-white dark:bg-black border border-gray-200 dark:border-white/10 rounded-sm pl-9 pr-2 py-2 text-xs focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/20 text-gray-900 dark:text-gray-200"
                    placeholder="e.g. 5"
                    min="0"
                  />
                </div>
              </div>
            </motion.div>

            <motion.div variants={{ hidden: { x: -20, opacity: 0 }, visible: { x: 0, opacity: 1 } }}>
              <label className="text-[10px] text-gray-500 uppercase mb-1 block font-bold">Projected Scenario</label>
              <div className="relative">
                <select 
                  value={scenario}
                  onChange={(e) => setScenario(e.target.value)}
                  className="w-full bg-white dark:bg-black border border-gray-200 dark:border-white/10 rounded-sm px-3 py-2 text-xs focus:border-cyan-500/50 focus:outline-none appearance-none text-gray-800 dark:text-gray-300"
                >
                  {SCENARIOS.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <div className="absolute right-3 top-2.5 pointer-events-none text-gray-500">
                  <ChevronRight className="w-3 h-3 rotate-90" />
                </div>
              </div>
            </motion.div>

             <motion.div variants={{ hidden: { x: -20, opacity: 0 }, visible: { x: 0, opacity: 1 } }}>
              <label className="text-[10px] text-gray-500 uppercase mb-1 block font-bold">Generate Count</label>
              <div className="relative">
                <Layers className="absolute left-3 top-2.5 w-3.5 h-3.5 text-gray-400" />
                <select 
                  value={variationCount}
                  onChange={(e) => setVariationCount(Number(e.target.value))}
                  className="w-full bg-white dark:bg-black border border-gray-200 dark:border-white/10 rounded-sm pl-9 pr-3 py-2 text-xs focus:border-cyan-500/50 focus:outline-none appearance-none text-gray-800 dark:text-gray-300"
                >
                  {[1, 2, 3, 4, 5].map(n => (
                    <option key={n} value={n}>{n} Variation{n > 1 ? 's' : ''}</option>
                  ))}
                </select>
                <div className="absolute right-3 top-2.5 pointer-events-none text-gray-500">
                  <ChevronRight className="w-3 h-3 rotate-90" />
                </div>
              </div>
            </motion.div>

            <motion.div variants={{ hidden: { x: -20, opacity: 0 }, visible: { x: 0, opacity: 1 } }}>
              <label className="text-[10px] text-gray-500 uppercase mb-1 block font-bold">Additional Context</label>
              <div className="relative">
                <FileText className="absolute left-3 top-2.5 w-3.5 h-3.5 text-gray-400" />
                <textarea 
                  value={additionalDetails}
                  onChange={(e) => setAdditionalDetails(e.target.value)}
                  className="w-full bg-white dark:bg-black border border-gray-200 dark:border-white/10 rounded-sm pl-9 pr-3 py-2 text-xs focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/20 h-20 resize-none placeholder:text-gray-400 dark:placeholder:text-gray-700 custom-scrollbar text-gray-900 dark:text-gray-200"
                  placeholder="Distinguishing marks, scars..."
                />
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Action Button */}
        <div className="p-5 border-t border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-black/40 mt-auto">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleGenerate(false)}
            disabled={isProcessing}
            className={`w-full py-3 text-center font-bold tracking-[0.2em] text-xs relative overflow-hidden group transition-all border border-cyan-600/30 dark:border-cyan-500/30 ${isProcessing ? 'cursor-not-allowed opacity-50' : 'hover:border-cyan-600 dark:hover:border-cyan-500 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]'}`}
          >
            <div className={`absolute inset-0 bg-cyan-100/30 dark:bg-cyan-950/30 ${isProcessing ? 'animate-pulse' : ''}`}></div>
            <div className="relative flex items-center justify-center gap-2 text-cyan-700 dark:text-cyan-400">
              {isProcessing ? (
                <>PROCESSING <span className="animate-spin">⟳</span></>
              ) : (
                <>RUN SIMULATION <Play className="w-3 h-3 fill-cyan-700 dark:fill-cyan-400" /></>
              )}
            </div>
          </motion.button>
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 flex items-center gap-2 text-red-600 dark:text-red-500 text-[10px] bg-red-100/50 dark:bg-red-950/20 p-2 border border-red-500/20 rounded-sm"
              >
                <AlertCircle className="w-3 h-3" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* --- RIGHT PANEL: Flex Row Wrapper --- */}
      <motion.div 
        className="flex-1 flex flex-row h-full relative overflow-hidden bg-gray-50/90 dark:bg-gray-950/80 transition-colors duration-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {/* Header Overlay (Absolute) */}
        <div className="absolute top-0 left-0 w-full p-4 md:p-6 flex justify-between items-start z-30 pointer-events-none bg-gradient-to-b from-gray-50 via-gray-50/90 to-transparent dark:from-black dark:via-black/90 dark:to-transparent h-32 transition-colors duration-300">
          <div className="pointer-events-auto mt-1">
            <h1 className="text-xl md:text-2xl font-bold tracking-tighter mb-1 leading-none text-transparent bg-clip-text bg-gradient-to-b from-gray-900 to-gray-500 dark:from-white dark:to-white/10">Reunite.ai</h1>
            <p className="text-[10px] text-cyan-700 dark:text-cyan-400 font-mono tracking-widest uppercase mb-1">Multi-Scenario Identity Reconstruction</p>
            <div className="flex items-center gap-2">
               <div className="h-0.5 w-6 bg-cyan-600 dark:bg-cyan-500 rounded-full"></div>
            </div>
          </div>
          <div className="flex flex-col items-end pointer-events-auto mr-12 md:mr-14">
             <div className="flex items-center gap-1.5 mb-1 opacity-70">
                <span className="text-[8px] text-gray-500 uppercase tracking-widest">Powered by</span>
                <div className="flex items-center gap-1">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg" alt="Google Gemini" className="h-3 w-auto dark:brightness-0 dark:invert opacity-70 dark:opacity-100" />
                  <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300 translate-y-[0.5px]">3</span>
                </div>
             </div>
             <div className="flex items-center gap-1.5 px-2 py-0.5 bg-white/60 dark:bg-black/60 border border-green-500/20 rounded-full text-[8px] text-green-600 dark:text-green-400 backdrop-blur-md">
               <span className="w-1 h-1 rounded-full bg-green-500 animate-pulse"></span>
               ONLINE
             </div>
          </div>
        </div>

        {/* CENTER: Main Image Display */}
        <div className="flex-1 flex flex-col relative min-w-0 mt-10">
          
          <div className="flex-1 flex items-center justify-center p-4 md:p-8 pt-40 pb-16">
            <div className="relative w-full h-full max-h-[85vh] max-w-6xl flex flex-col rounded-lg border border-gray-200 dark:border-white/10 bg-white/50 dark:bg-black/50 backdrop-blur-sm overflow-hidden shadow-2xl group transition-colors duration-300">
              
              {/* Image Area */}
              <div className="flex-1 relative overflow-hidden bg-gray-50 dark:bg-black flex items-center justify-center mt-22">
                {/* Background Grid Pattern inside frame */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>

                <AnimatePresence mode="wait">
                  {getSelectedResult() ? (
                    <motion.div 
                      key={selectedResultId}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="relative w-full h-full flex items-center justify-center"
                    >
                      <img 
                        src={getSelectedResult()?.image} 
                        alt="Reconstructed" 
                        className="max-w-full max-h-full object-contain"
                      />
                      
                      {/* Analysis Caption Overlay */}
                      <div className="absolute bottom-0 left-0 w-full bg-white/95 dark:bg-black/90 backdrop-blur-md border-t border-cyan-500/30 p-4 md:p-6 transition-transform duration-300 transform translate-y-0">
                         <div className="flex items-center justify-between mb-2">
                           <div className="flex items-center gap-3">
                              <span className="bg-cyan-100/50 dark:bg-cyan-950/50 text-cyan-700 dark:text-cyan-400 text-[10px] font-bold tracking-widest uppercase border border-cyan-500/30 px-2 py-0.5 rounded-sm">
                                THOUGHT PROCESS
                              </span>
                              <div className="h-px w-24 bg-gradient-to-r from-cyan-500/50 to-transparent"></div>
                           </div>
                           <button 
                             onClick={handleDownload}
                             className="text-gray-500 hover:text-cyan-600 dark:text-gray-400 dark:hover:text-cyan-400 transition-colors"
                             title="Download"
                           >
                             <Download className="w-4 h-4" />
                           </button>
                         </div>
                         <p className="text-gray-700 dark:text-gray-200 text-sm font-mono leading-relaxed border-l-2 border-cyan-500/50 pl-3">
                           {getSelectedResult()?.caption}
                         </p>
                      </div>
                    </motion.div>
                  ) : isProcessing ? (
                    // Futuristic Processing State
                    <div className="w-full max-w-lg p-6 bg-white/80 dark:bg-black/80 border border-cyan-500/20 rounded-md backdrop-blur-xl relative overflow-hidden shadow-lg">
                       <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-scan"></div>
                       
                       <div className="flex items-center justify-between mb-4 border-b border-gray-200 dark:border-white/10 pb-2">
                          <span className="text-cyan-600 dark:text-cyan-400 text-xs font-bold tracking-widest flex items-center gap-2">
                            <Terminal className="w-4 h-4" /> SYSTEM TERMINAL
                          </span>
                          <span className="text-gray-500 text-[10px] animate-pulse">Processing...</span>
                       </div>

                       <div 
                         ref={logContainerRef}
                         className="h-48 overflow-y-auto font-mono text-xs space-y-1.5 custom-scrollbar mb-4 text-green-600 dark:text-green-400/80"
                       >
                         {terminalLog.map((log, i) => (
                           <motion.div 
                             key={i} 
                             initial={{ opacity: 0, x: -10 }} 
                             animate={{ opacity: 1, x: 0 }}
                             className="border-l-2 border-green-500/20 pl-2"
                           >
                             {log}
                           </motion.div>
                         ))}
                         <motion.div 
                           animate={{ opacity: [0, 1, 0] }} 
                           transition={{ repeat: Infinity, duration: 0.8 }}
                           className="w-2 h-4 bg-green-500/50 inline-block align-middle ml-1"
                         />
                       </div>
                    </div>
                  ) : (
                    // Empty State
                    <div className="text-center opacity-40 dark:opacity-20">
                      <div className="w-32 h-32 border-2 border-dashed border-gray-400 dark:border-white rounded-full flex items-center justify-center mx-auto mb-4 animate-[spin_10s_linear_infinite]">
                         <Search className="w-12 h-12" />
                      </div>
                      <p className="tracking-[0.2em] text-sm uppercase text-gray-600 dark:text-gray-300">Awaiting Neural Input</p>
                    </div>
                  )}
                </AnimatePresence>

                {/* Decorative Corners */}
                <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-gray-300 dark:border-white/20"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-gray-300 dark:border-white/20"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-gray-300 dark:border-white/20"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-gray-300 dark:border-white/20"></div>
              </div>
            </div>
          </div>
          
          {/* Bottom Info Strip */}
          <div className="h-8 bg-gray-100 dark:bg-black border-t border-gray-200 dark:border-white/10 flex items-center justify-between px-6 text-[10px] text-gray-500 dark:text-gray-600 font-mono select-none transition-colors duration-300">
             <div>SESSION_ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</div>
             <div className="flex gap-4">
                <span className={isProcessing ? "text-cyan-600 dark:text-cyan-500 animate-pulse" : ""}>PROCESSING_CORE: {isProcessing ? "BUSY" : "IDLE"}</span>
                <span>DATA_STREAM: SECURE</span>
             </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR: Gallery */}
        <motion.div 
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: results.length > 0 || isProcessing ? 160 : 0, opacity: results.length > 0 || isProcessing ? 1 : 0 }}
          className="flex-shrink-0 bg-white dark:bg-black border-l border-gray-200 dark:border-white/10 flex flex-col z-20 h-full shadow-2xl transition-all duration-300"
        >
          <div className="p-3 bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-white/10 text-[9px] text-center text-gray-500 dark:text-gray-400 font-bold tracking-widest uppercase">
            Data Gallery
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
            {results.map((item, idx) => (
              <motion.div 
                key={item.id}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                onClick={() => setSelectedResultId(item.id)}
                className={`relative w-full aspect-video rounded-sm cursor-pointer border-2 transition-all group overflow-hidden ${selectedResultId === item.id ? 'border-cyan-600 dark:border-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)] scale-105 z-10' : 'border-transparent hover:border-gray-300 dark:hover:border-white/30 grayscale hover:grayscale-0'}`}
              >
                <img src={item.image} className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white/80 dark:bg-black/80 flex items-center justify-center text-[8px] text-black dark:text-white font-mono border border-gray-400 dark:border-white/20">
                  {idx + 1}
                </div>
              </motion.div>
            ))}
            
            {/* Generate Next Set Button in Sidebar if we have results */}
            {results.length > 0 && !isProcessing && (
               <motion.button
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 onClick={() => handleGenerate(true)}
                 className="w-full py-4 border border-dashed border-gray-300 dark:border-white/20 rounded-sm flex flex-col items-center justify-center gap-1 text-gray-500 hover:text-cyan-600 dark:hover:text-cyan-400 hover:border-cyan-500/50 transition-colors group"
               >
                 <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                 <span className="text-[8px] tracking-widest uppercase font-bold">Generate More</span>
               </motion.button>
            )}
          </div>
        </motion.div>

      </motion.div>
    </motion.div>
  );
};

export default Dashboard;