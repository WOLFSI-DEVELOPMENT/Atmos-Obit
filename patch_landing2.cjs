const fs = require('fs');

const code = `import React, { useEffect, useState } from 'react';
import { Sparkles, ArrowDown, ArrowUp } from 'lucide-react';
import { motion } from 'motion/react';

interface LandingPageProps {
  onEnterApp: () => void;
}

export function LandingPage({ onEnterApp }: LandingPageProps) {
  const [offset, setOffset] = useState(0);
  const [input, setInput] = useState('');

  // Simple conveyor belt animation
  useEffect(() => {
    const interval = setInterval(() => {
      setOffset((prev) => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#1c1c1c] text-white font-sans overflow-x-hidden selection:bg-neutral-800">
      <style>{\`
        .handwritten {
          font-family: 'Comic Sans MS', cursive, sans-serif;
        }
        .bg-dotted {
          background-color: #f4f5f6;
          background-image: radial-gradient(#d1d5db 2px, transparent 2px);
          background-size: 32px 32px;
        }
      \`}</style>

      {/* Dark Hero Section - Matching App Theme */}
      <div className="relative w-full min-h-screen flex flex-col overflow-hidden">
        
        {/* Background Images Overlay mimicking the screenshot - Now full screen width */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.35]">
          <img src="https://res.cloudinary.com/dwthgcx5j/image/upload/v1787094724/NEON_DRIFT_X_game_cover_202605241419_fjybae.jpg" className="absolute top-[8%] left-[4%] w-48 h-32 object-cover rounded-xl -rotate-6 shadow-2xl" alt="NEON DRIFT X" />
          <img src="https://res.cloudinary.com/dwthgcx5j/image/upload/v1787094715/Blocky_Crossing_game_cover_202605241419_czbolu.jpg" className="absolute top-[10%] right-[6%] w-48 h-32 object-cover rounded-xl rotate-3 shadow-2xl" alt="Blocky Crossing" />
          <img src="https://res.cloudinary.com/dwthgcx5j/image/upload/v1787094715/Titan_Offroad_game_cover_202605241419_big2ck.jpg" className="absolute top-[6%] left-[38%] w-48 h-32 object-cover rounded-xl -rotate-3 shadow-2xl" alt="Titan Offroad" />
          <img src="https://res.cloudinary.com/dwthgcx5j/image/upload/v1787094701/Armored_muscle_cars_crashing_hig__202605241419_yqugg9.jpg" className="absolute bottom-[8%] left-[5%] w-48 h-32 object-cover rounded-xl rotate-6 shadow-2xl" alt="Armored muscle cars" />
          <img src="https://res.cloudinary.com/dwthgcx5j/image/upload/v1787094698/Cube_Clash.io_game_cover_202605241420_d4eaeg.jpg" className="absolute bottom-[10%] right-[5%] w-48 h-32 object-cover rounded-xl -rotate-2 shadow-2xl" alt="Cube Clash.io" />
          <img src="https://res.cloudinary.com/dwthgcx5j/image/upload/v1787094698/Shadow_Protocol_cover_art_202605241419_orggay.jpg" className="absolute bottom-[6%] left-[35%] w-48 h-32 object-cover rounded-xl rotate-3 shadow-2xl" alt="Shadow Protocol" />
          <img src="https://res.cloudinary.com/dwthgcx5j/image/upload/v1787094681/Flappy_Sky_game_cover_202605241419_to1erv.jpg" className="absolute top-[42%] left-[2%] w-48 h-32 object-cover rounded-xl -rotate-12 shadow-2xl" alt="Flappy Sky" />
          <img src="https://res.cloudinary.com/dwthgcx5j/image/upload/v1787094680/Frozen_Survival_game_cover_art_202605241420_ryf9df.jpg" className="absolute top-[45%] right-[2%] w-48 h-32 object-cover rounded-xl rotate-6 shadow-2xl" alt="Frozen Survival" />
          <img src="https://res.cloudinary.com/dwthgcx5j/image/upload/v1787094676/Zombie_District_game_cover_202605241419_iyozmx.jpg" className="absolute top-[40%] left-[65%] w-48 h-32 object-cover rounded-xl -rotate-6 shadow-2xl" alt="Zombie District" />
        </div>

        {/* Nav */}
        <nav className="relative z-50 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-3">
            <div className="w-[34px] h-[34px] rounded-xl flex items-center justify-center relative overflow-hidden bg-transparent">
              <img src="https://res.cloudinary.com/dwthgcx5j/image/upload/v1787020978/rounded-image_1_q5ruom.png" alt="App Icon" className="w-full h-full object-cover" />
            </div>
            <span className="font-bold text-[18px] text-white tracking-tight whitespace-nowrap">Atmos orbit</span>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <a href="#" className="text-white/70 hover:text-white font-medium transition-colors">Careers</a>
            <div className="w-px h-4 bg-white/20"></div>
            <a href="#" className="text-white/70 hover:text-white font-medium transition-colors">Dashboard</a>
            <button 
              onClick={onEnterApp}
              className="bg-white hover:bg-neutral-200 text-black px-6 py-2.5 rounded-full font-bold transition-all"
            >
              Start Building
            </button>
          </div>
        </nav>

        {/* Center Hero Content with Input Box */}
        <div className="flex-1 flex flex-col items-center justify-center w-full max-w-3xl mx-auto px-4 -mt-20 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-3 text-center">
              Describe a <span className="italic font-serif">Roblox system...</span>
            </h1>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="w-full flex flex-col gap-2"
          >
            {/* Horizontal Quick Prompt Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 px-1 scrollbar-none no-scrollbar justify-center">
              {['Procedural Spawner', 'Obby Simulator', 'Day-Night Cycle', 'Laser Tag Arena'].map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setInput(preset);
                    onEnterApp();
                  }}
                  className="text-[13px] font-medium bg-[#2a2a2a]/50 backdrop-blur-xl hover:bg-[#3a3a3a]/60 text-white/90 px-4 py-2 rounded-xl whitespace-nowrap transition-colors shrink-0 flex items-center gap-1.5"
                >
                  <Sparkles size={14} className="text-white opacity-70" strokeWidth={2.5} /> {preset}
                </button>
              ))}
            </div>

            {/* Input Prompt Box - Sleek styling matching home page */}
            <div className="w-full bg-[#2a2a2a]/50 backdrop-blur-xl rounded-2xl relative p-4 flex flex-col min-h-[140px] shadow-2xl border border-white/5">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask AI to generate Luau scripts..."
                className="w-full flex-1 min-h-[60px] bg-transparent text-[#e0e0e0] px-2 py-2 text-[16px] focus:outline-none placeholder-neutral-500 resize-none font-medium flex items-center transition-colors"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (input.trim()) onEnterApp();
                  }
                }}
              />
              <div className="flex items-center justify-between mt-2 px-1">
                <div className="flex items-center gap-2 text-neutral-500">
                  <button className="p-2 hover:bg-[#3a3a3a]/50 rounded-lg transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                  </button>
                </div>
                <button 
                  onClick={() => { if(input.trim()) onEnterApp(); else onEnterApp(); }}
                  className={\`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 \${input.trim() ? 'bg-white text-black hover:scale-105' : 'bg-[#3a3a3a] text-neutral-500'}\`}
                >
                  <ArrowUp size={20} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-neutral-500 z-10"
        >
          <div className="flex items-center gap-2 font-bold tracking-wider text-[11px] uppercase">
            <ArrowDown size={14} strokeWidth={3} />
            Scroll to discover more
            <ArrowDown size={14} strokeWidth={3} />
          </div>
        </motion.div>
      </div>

      {/* Business Section (White Dotted Theme) */}
      <motion.div 
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative w-full pt-32 pb-0 bg-dotted overflow-hidden flex flex-col items-center"
      >
        <div className="text-center relative z-10 mb-20 w-full max-w-5xl">
          <h2 className="text-5xl md:text-7xl lg:text-[6.5rem] leading-[0.95] font-black text-black uppercase tracking-tighter drop-shadow-sm mb-0">
            Your First
          </h2>
          <h2 className="text-7xl md:text-[8rem] lg:text-[10rem] leading-[0.85] font-black text-black uppercase tracking-tighter drop-shadow-sm mb-4">
            Business
          </h2>
          <div className="inline-block relative">
            <span className="bg-black text-white text-6xl md:text-7xl lg:text-[6rem] leading-[1.1] font-black uppercase tracking-tighter px-10 py-3 rounded-[3rem] shadow-2xl inline-block transform -rotate-1">
              Starts here
            </span>
            {/* 3D Robux-like icon placeholder */}
            <div className="absolute -right-16 -bottom-10 text-8xl text-cyan-400 drop-shadow-[0_10px_20px_rgba(34,211,238,0.4)] rotate-12 font-black italic z-20">
              $
            </div>
          </div>
        </div>

        {/* Sticky Notes */}
        <div className="absolute top-20 left-[2%] md:left-[10%] w-56 h-56 bg-[#ffd11a] p-6 shadow-[10px_15px_30px_rgba(0,0,0,0.15)] -rotate-6 handwritten text-2xl font-bold text-neutral-800 leading-tight transition-transform hover:scale-105 hover:-rotate-3 z-10">
          <div className="absolute top-[-15px] left-1/2 -translate-x-1/2 w-24 h-8 bg-white/40 rotate-2"></div>
          ideas for<br/>Roblox game
        </div>
        <div className="absolute top-60 left-[-4%] md:left-[4%] w-60 h-60 bg-[#ffc400] p-6 shadow-[5px_20px_35px_rgba(0,0,0,0.2)] rotate-6 handwritten text-2xl font-bold text-neutral-800 flex flex-col justify-center z-20 transition-transform hover:scale-105 hover:-rotate-2">
          <div className="absolute top-[-10px] left-1/3 w-20 h-8 bg-white/40 -rotate-3"></div>
          &lt;username&gt;<br/>786k visits
        </div>
        <div className="absolute top-28 right-[2%] md:right-[10%] w-64 h-64 bg-[#ffd11a] p-6 shadow-[15px_20px_40px_rgba(0,0,0,0.15)] rotate-[15deg] handwritten text-3xl font-bold text-neutral-800 flex flex-col justify-center z-20 transition-transform hover:scale-105 hover:rotate-[10deg]">
          <div className="absolute top-[-12px] right-1/4 w-28 h-8 bg-white/40 rotate-6"></div>
          Make alot<br/>$$$$$$$$$
        </div>

        {/* Conveyor Belt */}
        <div className="w-[110%] h-[150px] bg-gradient-to-b from-neutral-800 to-black mt-8 relative border-t-[8px] border-neutral-700 border-b-[20px] border-neutral-900 shadow-[0_-20px_50px_rgba(0,0,0,0.1)] flex items-center overflow-hidden transform rotate-0 z-30">
           {/* Inner metallic track */}
           <div className="absolute inset-y-0 inset-x-0 border-y-[6px] border-neutral-600/60 pointer-events-none z-20"></div>
           
           {/* Belt Texture */}
           <div className="absolute inset-0 opacity-[0.15]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 20px, #fff 20px, #fff 40px)' }}></div>
           
           {/* Moving Gems */}
           <div 
             className="flex items-center gap-48 whitespace-nowrap relative z-10"
             style={{ transform: \`translateX(-\${offset}%)\` }}
           >
             {[...Array(20)].map((_, i) => (
                <div key={i} className="w-24 h-24 bg-cyan-400 rounded-full border-[8px] border-cyan-200 shadow-[0_0_35px_rgba(34,211,238,0.9),inset_0_8px_15px_rgba(255,255,255,0.7)] flex items-center justify-center shrink-0">
                  <div className="w-12 h-12 bg-cyan-100 rounded-full shadow-[inset_0_-4px_8px_rgba(0,0,0,0.2)]"></div>
                </div>
             ))}
           </div>

           {/* Rivets Top */}
           <div className="absolute top-2 left-[5%] w-3 h-3 bg-white rounded-full shadow-md z-30"></div>
           <div className="absolute top-2 left-[25%] w-3 h-3 bg-white rounded-full shadow-md z-30"></div>
           <div className="absolute top-2 left-[45%] w-3 h-3 bg-white rounded-full shadow-md z-30"></div>
           <div className="absolute top-2 left-[65%] w-3 h-3 bg-white rounded-full shadow-md z-30"></div>
           <div className="absolute top-2 left-[85%] w-3 h-3 bg-white rounded-full shadow-md z-30"></div>
           
           {/* Rivets Bottom */}
           <div className="absolute bottom-3 left-[15%] w-3 h-3 bg-white rounded-full shadow-md z-30"></div>
           <div className="absolute bottom-3 left-[35%] w-3 h-3 bg-white rounded-full shadow-md z-30"></div>
           <div className="absolute bottom-3 left-[55%] w-3 h-3 bg-white rounded-full shadow-md z-30"></div>
           <div className="absolute bottom-3 left-[75%] w-3 h-3 bg-white rounded-full shadow-md z-30"></div>
           <div className="absolute bottom-3 left-[95%] w-3 h-3 bg-white rounded-full shadow-md z-30"></div>
        </div>
      </motion.div>

      {/* Footer */}
      <footer className="w-full bg-[#f4f5f6] pt-12 pb-10 px-8 max-w-7xl mx-auto flex flex-col z-40 relative">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-10 relative">
          
          <div className="col-span-1 md:col-span-2 flex items-start gap-3 text-black">
            <div className="w-[34px] h-[34px] rounded-xl flex items-center justify-center relative overflow-hidden bg-transparent">
              <img src="https://res.cloudinary.com/dwthgcx5j/image/upload/v1787020978/rounded-image_1_q5ruom.png" alt="App Icon" className="w-full h-full object-cover" />
            </div>
            <span className="font-bold text-[22px] tracking-tight whitespace-nowrap">Atmos orbit</span>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-neutral-900 mb-1">Follow Us</h4>
            <a href="#" className="text-neutral-500 hover:text-black font-medium transition-colors">X (Twitter)</a>
            <a href="#" className="text-neutral-500 hover:text-black font-medium transition-colors">Discord</a>
            <a href="#" className="text-neutral-500 hover:text-black font-medium transition-colors">LinkedIn</a>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-neutral-900 mb-1">Legal</h4>
            <a href="#" className="text-neutral-500 hover:text-black font-medium transition-colors">Privacy Policy</a>
            <a href="#" className="text-neutral-500 hover:text-black font-medium transition-colors">Terms of Service</a>
          </div>
        </div>

        <div className="border-t border-neutral-300 pt-8 text-sm text-neutral-500 font-medium">
          founders@atmosorbit.gg - South, Governors Avenue 19904, Delaware, US - © Atmos Orbit Labs, Inc.
        </div>
      </footer>
    </div>
  );
}
`;

fs.writeFileSync('src/components/LandingPage.tsx', code);
console.log("Patched LandingPage");
