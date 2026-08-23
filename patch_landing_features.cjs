const fs = require('fs');

const code = `import React, { useState } from 'react';
import { Sparkles, ArrowDown, ArrowUp, Plus, Code2, Check, Box } from 'lucide-react';
import { motion } from 'motion/react';

interface LandingPageProps {
  onEnterApp: () => void;
}

export function LandingPage({ onEnterApp }: LandingPageProps) {
  const [input, setInput] = useState('');

  return (
    <div className="w-full min-h-screen bg-[#1c1c1c] text-white font-sans overflow-x-hidden selection:bg-neutral-800">

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

            {/* Input Prompt Box */}
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
            Scroll to discover features
            <ArrowDown size={14} strokeWidth={3} />
          </div>
        </motion.div>
      </div>

      {/* Features Section - Dark Bento Grid */}
      <div className="relative w-full bg-[#0a0a0a] pt-24 pb-32 px-6 md:px-12 flex flex-col items-center z-20">
        <div className="w-full max-w-[1200px] mx-auto">
          
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-12"
          >
            <h2 className="text-[32px] md:text-[40px] font-medium tracking-tight text-white mb-3">
              Built for Roblox creators
            </h2>
            <p className="text-[#a0a0a0] text-[17px]">
              Automate code generation throughout the entire development journey.
            </p>
          </motion.div>

          {/* Grid Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Feature 1: Surgical Code Engine */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
              className="bg-[#111111] border border-[#222] hover:border-[#333] transition-colors rounded-[24px] p-4 flex flex-col group"
            >
              {/* Graphic Area */}
              <div className="w-full h-56 bg-gradient-to-br from-[#1c1410] to-[#111111] rounded-xl mb-6 relative overflow-hidden border border-white/5">
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/20 blur-[70px] rounded-full -translate-y-1/2 translate-x-1/3"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* Floating Elements */}
                  <div className="w-36 h-40 bg-[#161616] rounded-xl border border-white/10 shadow-2xl flex flex-col p-4 gap-3 relative -left-4">
                    <div className="w-1/3 h-2 bg-white/20 rounded-full"></div>
                    <div className="w-3/4 h-2 bg-white/10 rounded-full"></div>
                    <div className="w-2/3 h-2 bg-white/10 rounded-full"></div>
                    <div className="w-full h-2 bg-white/5 rounded-full mt-auto"></div>
                  </div>
                  <div className="absolute right-10 bottom-10 w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full border-[4px] border-[#161616] flex items-center justify-center shadow-2xl shadow-orange-500/20">
                    <Code2 size={24} className="text-white" strokeWidth={2.5} />
                  </div>
                </div>
              </div>
              {/* Text Area */}
              <h3 className="text-[22px] font-medium tracking-tight text-white mb-2 px-2">Surgical Code Engine</h3>
              <p className="text-[#8a8a8a] text-[15px] leading-relaxed mb-6 flex-1 px-2">
                Generate and edit exact lines of Luau code without breaking or completely rewriting your existing game structure.
              </p>
              <div className="flex justify-end px-2">
                <div className="w-7 h-7 rounded-full border border-[#333] flex items-center justify-center text-[#555] group-hover:text-white group-hover:border-white/50 transition-colors">
                  <Plus size={14} />
                </div>
              </div>
            </motion.div>

            {/* Feature 2: Live Studio Sync */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="bg-[#111111] border border-[#222] hover:border-[#333] transition-colors rounded-[24px] p-4 flex flex-col group"
            >
              {/* Graphic Area */}
              <div className="w-full h-56 bg-gradient-to-br from-[#1a1224] to-[#111111] rounded-xl mb-6 relative overflow-hidden border border-white/5">
                <div className="absolute top-0 left-0 w-64 h-64 bg-fuchsia-500/20 blur-[70px] rounded-full -translate-y-1/3 -translate-x-1/4"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* Floating Pill */}
                  <div className="w-48 h-14 bg-[#161616] rounded-full border border-white/10 shadow-2xl flex items-center px-4 gap-4">
                    <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                      <Check size={14} className="text-black" strokeWidth={3} />
                    </div>
                    <div className="flex-1 h-2.5 bg-white/10 rounded-full"></div>
                  </div>
                </div>
              </div>
              {/* Text Area */}
              <h3 className="text-[22px] font-medium tracking-tight text-white mb-2 px-2">Live Studio Sync</h3>
              <p className="text-[#8a8a8a] text-[15px] leading-relaxed mb-6 flex-1 px-2">
                Connect via secure PIN to push AI-generated scripts and systems directly into your live Roblox Studio place instantly.
              </p>
              <div className="flex justify-end px-2">
                <div className="w-7 h-7 rounded-full border border-[#333] flex items-center justify-center text-[#555] group-hover:text-white group-hover:border-white/50 transition-colors">
                  <Plus size={14} />
                </div>
              </div>
            </motion.div>

            {/* Feature 3: Smart Asset Search */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              className="bg-[#111111] border border-[#222] hover:border-[#333] transition-colors rounded-[24px] p-4 flex flex-col group"
            >
              {/* Graphic Area */}
              <div className="w-full h-56 bg-gradient-to-br from-[#241216] to-[#111111] rounded-xl mb-6 relative overflow-hidden border border-white/5">
                <div className="absolute top-0 left-0 w-64 h-64 bg-rose-500/20 blur-[70px] rounded-full -translate-y-1/2 translate-x-1/4"></div>
                <div className="absolute inset-0 flex items-center justify-center pr-6">
                  {/* Floating Coins/Assets */}
                  <div className="flex -space-x-6">
                    {[3, 2, 1].map((i) => (
                      <div key={i} className={\`w-16 h-16 bg-[#161616] rounded-full border border-white/10 shadow-2xl flex items-center justify-center transform \${i===1 ? 'z-30 scale-110' : i===2 ? 'z-20 scale-100' : 'z-10 scale-90 opacity-70'}\`}>
                        <Box size={24} className="text-rose-500" strokeWidth={2.5} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* Text Area */}
              <h3 className="text-[22px] font-medium tracking-tight text-white mb-2 px-2">Smart Asset Fetching</h3>
              <p className="text-[#8a8a8a] text-[15px] leading-relaxed mb-6 flex-1 px-2">
                Automatically search and integrate safe, free 3D models and audio from the Creator Marketplace into your builds.
              </p>
              <div className="flex justify-end px-2">
                <div className="w-7 h-7 rounded-full border border-[#333] flex items-center justify-center text-[#555] group-hover:text-white group-hover:border-white/50 transition-colors">
                  <Plus size={14} />
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>

      {/* Footer (Dark Mode) */}
      <footer className="w-full bg-[#0a0a0a] pt-16 pb-12 px-8 flex flex-col z-40 relative border-t border-white/5">
        <div className="max-w-[1200px] mx-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 relative">
            
            <div className="col-span-1 md:col-span-2 flex items-start gap-3 text-white">
              <div className="w-[34px] h-[34px] rounded-xl flex items-center justify-center relative overflow-hidden bg-transparent">
                <img src="https://res.cloudinary.com/dwthgcx5j/image/upload/v1787020978/rounded-image_1_q5ruom.png" alt="App Icon" className="w-full h-full object-cover" />
              </div>
              <span className="font-bold text-[22px] tracking-tight whitespace-nowrap">Atmos orbit</span>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="font-bold text-white mb-1 text-[15px]">Follow Us</h4>
              <a href="#" className="text-[#8a8a8a] hover:text-white font-medium transition-colors text-[14px]">X (Twitter)</a>
              <a href="#" className="text-[#8a8a8a] hover:text-white font-medium transition-colors text-[14px]">Discord</a>
              <a href="#" className="text-[#8a8a8a] hover:text-white font-medium transition-colors text-[14px]">LinkedIn</a>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="font-bold text-white mb-1 text-[15px]">Legal</h4>
              <a href="#" className="text-[#8a8a8a] hover:text-white font-medium transition-colors text-[14px]">Privacy Policy</a>
              <a href="#" className="text-[#8a8a8a] hover:text-white font-medium transition-colors text-[14px]">Terms of Service</a>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 text-[13px] text-[#666] font-medium">
            founders@atmosorbit.gg - South, Governors Avenue 19904, Delaware, US - © Atmos Orbit Labs, Inc.
          </div>
        </div>
      </footer>
    </div>
  );
}
`

fs.writeFileSync('src/components/LandingPage.tsx', code);
