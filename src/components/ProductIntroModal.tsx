import { useState, useEffect } from 'react';
import { useRef } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
// @ts-ignore
import coreURL from '@ffmpeg/core?url';
// @ts-ignore
import wasmURL from '@ffmpeg/core/wasm?url';
import { fetchFile } from '@ffmpeg/util';


import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Terminal, Settings, Play, Pause, Volume2, Maximize, Download, Video } from 'lucide-react';

const slideTransition = {
  initial: { opacity: 0, scale: 0.95, y: 20 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 1.05, y: -20 },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as any }
};

function ProblemSlide() {
  return (
    <motion.div {...slideTransition} className="absolute inset-0 flex flex-col items-center justify-center bg-white text-black p-12 text-center">
      <motion.h2 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] as any }}
        className="text-5xl md:text-7xl font-bold tracking-tighter"
      >
        Building for Roblox <br/> shouldn't break your flow.
      </motion.h2>
      <div className="mt-12 flex gap-8 text-2xl font-medium text-neutral-400">
        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>Luau Scripting.</motion.span>
        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.0 }}>Rojo Workflows.</motion.span>
        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }}>Complex APIs.</motion.span>
      </div>
    </motion.div>
  );
}

function SolutionSlide() {
  return (
    <motion.div {...slideTransition} className="absolute inset-0 flex items-center justify-center bg-white text-black">
      <motion.h1 
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as any }}
        className="text-7xl md:text-9xl font-black tracking-tighter"
      >
        VibeCoder.
      </motion.h1>
    </motion.div>
  );
}

function FeaturesSlide() {
  return (
    <motion.div {...slideTransition} className="absolute inset-0 flex flex-col items-center justify-center bg-black text-white p-12">
      <h2 className="text-5xl font-bold tracking-tighter mb-16">The ultimate workspace.</h2>
      <div className="grid grid-cols-3 gap-8 w-full max-w-4xl">
        {[
          { icon: <Settings size={32} />, title: 'Hyper-Personalized', desc: 'Mechanical 3D buttons, custom fonts.' },
          { icon: <Terminal size={32} />, title: 'AST Patching', desc: 'Lightning-fast surgical code edits.' },
          { icon: <Play size={32} />, title: 'Multi-Model', desc: 'Gemini, OpenAI, Anthropic support.' },
        ].map((feat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 + 0.3, duration: 0.6 }}
            className="flex flex-col items-center text-center space-y-4"
          >
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
              {feat.icon}
            </div>
            <h3 className="text-xl font-semibold">{feat.title}</h3>
            <p className="text-neutral-400">{feat.desc}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function AISlide() {
  return (
    <motion.div {...slideTransition} className="absolute inset-0 flex flex-col items-center justify-center bg-white text-black p-12">
      <motion.div 
        animate={{ rotate: 360 }} 
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="mb-8"
      >
        <Sparkles size={80} className="text-blue-500" />
      </motion.div>
      <h2 className="text-6xl font-bold tracking-tighter mb-6 text-center">Your AI Co-Pilot.</h2>
      <p className="text-2xl text-neutral-500 font-medium">Translating natural language directly into production-ready Luau.</p>
    </motion.div>
  );
}

function DemoSlide() {
  const [text, setText] = useState('');
  const fullText = "Create a tycoon money dropper script";
  
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i < fullText.length) {
        setText(fullText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 50);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div {...slideTransition} className="absolute inset-0 flex items-center justify-center bg-neutral-100 text-black p-12">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-neutral-200">
        <div className="p-4 border-b border-neutral-100 bg-neutral-50 flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-red-400"></div>
          <div className="w-3 h-3 rounded-full bg-amber-400"></div>
          <div className="w-3 h-3 rounded-full bg-green-400"></div>
        </div>
        <div className="p-8 space-y-6">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-neutral-200 shrink-0"></div>
            <div className="bg-neutral-100 p-4 rounded-2xl rounded-tl-sm text-lg font-medium text-neutral-700 min-h-[60px] flex items-center">
              {text}<span className="w-0.5 h-5 bg-blue-500 ml-1 animate-pulse"></span>
            </div>
          </div>
          
          {text.length === fullText.length && (
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.5 }}
               className="flex gap-4"
             >
               <div className="w-10 h-10 rounded-full bg-blue-500 shrink-0 flex items-center justify-center text-white"><Sparkles size={20} /></div>
               <div className="bg-neutral-900 text-neutral-300 p-6 rounded-2xl rounded-tl-sm w-full font-mono text-sm shadow-inner">
                 <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 1 }} className="overflow-hidden whitespace-nowrap">
                   <span className="text-purple-400">local</span> Dropper = script.Parent
                 </motion.div>
                 <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 1, delay: 0.5 }} className="overflow-hidden whitespace-nowrap mt-2">
                   <span className="text-purple-400">while</span> <span className="text-blue-400">task</span>.wait(<span className="text-orange-400">1</span>) <span className="text-purple-400">do</span>
                 </motion.div>
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="ml-4 mt-2 text-green-400">
                   -- Spawns part and assigns value
                 </motion.div>
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.0 }} className="mt-2">
                   <span className="text-purple-400">end</span>
                 </motion.div>
               </div>
             </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function EndSlide({ onClose }: { onClose: () => void }) {
  return (
    <motion.div {...slideTransition} className="absolute inset-0 flex flex-col items-center justify-center bg-white text-black p-12">
      <h2 className="text-7xl font-black tracking-tighter mb-8">Ready to build?</h2>
      <button 
        onClick={onClose}
        className="px-10 py-5 bg-black text-white text-xl font-bold rounded-full hover:scale-105 transition-transform"
      >
        Enter Workspace
      </button>
    </motion.div>
  );
}


export function ProductIntroModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  
  const [showControls, setShowControls] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionProgress, setConversionProgress] = useState(0);
  const ffmpegRef = useRef(new FFmpeg());

  const handleRecord = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { displaySurface: "browser" },
        audio: false
      });

      const options = MediaRecorder.isTypeSupported('video/webm;codecs=vp9') 
        ? { mimeType: 'video/webm;codecs=vp9' } 
        : { mimeType: 'video/webm' };
        
      const mediaRecorder = new MediaRecorder(stream, options);
      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach(track => track.stop());
        setIsRecording(false);
        setIsConverting(true);

        const blob = new Blob(chunks, { type: 'video/webm' });
        
        try {
          const ffmpeg = ffmpegRef.current;
          
          ffmpeg.on('progress', ({ progress }) => {
            setConversionProgress(Math.round(progress * 100));
          });

          if (!ffmpeg.loaded) {
            await ffmpeg.load({
              coreURL,
              wasmURL,
            });
          }

          await ffmpeg.writeFile('input.webm', await fetchFile(blob));
          // Quick conversion using libx264
          await ffmpeg.exec(['-i', 'input.webm', '-c:v', 'libx264', '-preset', 'ultrafast', 'output.mp4']);
          
          const data = await ffmpeg.readFile('output.mp4');
          const mp4Blob = new Blob([(data as Uint8Array).buffer], { type: 'video/mp4' });
          const url = URL.createObjectURL(mp4Blob);
          
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = url;
          a.download = 'vibecoder-launch.mp4';
          document.body.appendChild(a);
          a.click();
          
          URL.revokeObjectURL(url);
          document.body.removeChild(a);
        } catch (err) {
          console.error("FFmpeg conversion failed:", err);
          alert("Conversion failed. See console.");
        } finally {
          setIsConverting(false);
          setConversionProgress(0);
        }
      };

      setStep(0);
      setCurrentTime(0);
      setIsPlaying(true);
      setIsRecording(true);

      mediaRecorder.start();

      setTimeout(() => {
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.stop();
        }
      }, totalDuration + 500);

    } catch (err) {
      console.error("Recording failed:", err);
      setIsRecording(false);
      setIsConverting(false);
    }
  };


  const timings = [
    4000, // 0: The Problem
    2500, // 1: The Solution
    4500, // 2: Key Features
    3500, // 3: The Role of AI
    6000, // 4: Live Demo
    999999 // 5: End
  ];
  
  const totalDuration = timings.slice(0, 5).reduce((a, b) => a + b, 0);

  useEffect(() => {
    if (!isPlaying) return;
    
    let animationFrameId: number;
    let lastTime = performance.now();

    const updateTimer = (time: number) => {
      const deltaTime = time - lastTime;
      lastTime = time;
      
      setCurrentTime(prev => {
        const nextTime = prev + deltaTime;
        
        // Calculate which step we should be on
        let accumulated = 0;
        let currentStep = 0;
        for (let i = 0; i < timings.length; i++) {
          accumulated += timings[i];
          if (nextTime < accumulated) {
            currentStep = i;
            break;
          }
        }
        
        if (currentStep !== step) {
          setStep(currentStep);
        }
        
        if (nextTime >= totalDuration) {
          setIsPlaying(false);
          return totalDuration;
        }
        return nextTime;
      });
      
      animationFrameId = requestAnimationFrame(updateTimer);
    };
    
    animationFrameId = requestAnimationFrame(updateTimer);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying, step]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercent = Math.min((currentTime / totalDuration) * 100, 100);

  return (
    <div className="fixed inset-0 z-[999] bg-[#161616] flex flex-col items-center justify-center p-8 md:p-16">
      
      {/* Video Player Container */}
      <div 
        className="w-full max-w-5xl aspect-video bg-white rounded-[2rem] overflow-hidden relative shadow-none border-none group"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
         {/* Native Video Player UI Overlay */}
         <div 
            className={`absolute inset-0 z-50 pointer-events-none transition-opacity duration-300 ${showControls || !isPlaying ? 'opacity-100' : 'opacity-0'}`}
         >
            {/* Top gradient (optional, for visibility) */}
            <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-black/40 to-transparent pointer-events-none" />
            
            {/* Play/Pause Large Center Icon (when paused) */}
            {!isPlaying && currentTime < totalDuration && (
               <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
                 <button 
                   onClick={() => setIsPlaying(true)}
                   className="w-20 h-20 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/70 hover:scale-105 transition-all"
                 >
                   <Play size={40} className="ml-2" />
                 </button>
               </div>
            )}

            {/* Bottom Controls Bar */}
            <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end px-6 py-4 pointer-events-auto">
               
               {/* Scrubber/Progress */}
               <div className="w-full h-1.5 bg-white/30 rounded-full mb-4 cursor-pointer relative overflow-hidden">
                  <div 
                    className="absolute left-0 top-0 bottom-0 bg-blue-500 rounded-full" 
                    style={{ width: `${progressPercent}%` }}
                  />
               </div>

               {/* Controls Row */}
               <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-4">
                     <button 
                       onClick={() => setIsPlaying(!isPlaying)}
                       className="hover:text-blue-400 transition-colors"
                     >
                       {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                     </button>
                     <button className="hover:text-blue-400 transition-colors">
                       <Volume2 size={22} />
                     </button>
                     <span className="text-sm font-medium tracking-wide drop-shadow-md font-mono">
                        {formatTime(currentTime)} / {formatTime(totalDuration)}
                     </span>
                  </div>
                  
                  
                  <div className="flex items-center gap-4">
                     <button 
                       onClick={handleRecord}
                       disabled={isRecording || isConverting}
                       title="Record & Download as MP4"
                       className={`transition-colors flex items-center gap-2 text-sm font-medium ${isRecording ? 'text-red-400 animate-pulse' : isConverting ? 'text-yellow-400' : 'hover:text-blue-400'}`}
                     >
                       {isRecording ? (
                         <>
                           <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                           RECORDING...
                         </>
                       ) : isConverting ? (
                         <>
                           <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                           MP4: {conversionProgress}%
                         </>
                       ) : (
                         <Download size={20} />
                       )}
                     </button>
                     <button className="hover:text-blue-400 transition-colors">
                       <Maximize size={20} />
                     </button>
                  </div>

               </div>
            </div>
         </div>

         {/* The Actual "Video" Content (Framer Motion Sequence) */}
         <div className={`w-full h-full relative ${!isPlaying ? 'pointer-events-none' : ''}`}>
           <AnimatePresence mode="wait">
              {step === 0 && <ProblemSlide key="0" />}
              {step === 1 && <SolutionSlide key="1" />}
              {step === 2 && <FeaturesSlide key="2" />}
              {step === 3 && <AISlide key="3" />}
              {step === 4 && <DemoSlide key="4" />}
              {step >= 5 && <EndSlide key="5" onClose={onClose} />}
           </AnimatePresence>
         </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 1 }}
        className="mt-12 max-w-2xl text-center"
      >
         <h2 className="text-white text-2xl font-bold tracking-tight mb-3">Welcome to VibeCoder</h2>
         <p className="text-neutral-400 text-sm md:text-base leading-relaxed">
            Your intelligent co-pilot for Roblox game development. We're combining the power of multi-model LLMs with a seamless, tactile workspace to let you turn your natural language ideas into production-ready Luau code and game mechanics in seconds.
         </p>
      </motion.div>
    </div>
  );
}
