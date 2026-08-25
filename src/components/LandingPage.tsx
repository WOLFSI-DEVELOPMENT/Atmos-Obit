import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowDown, ArrowUp, Plus, Code2, Check, Box } from 'lucide-react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';

interface LandingPageProps {
  onEnterApp: () => void;
  onNavigate?: (view: 'landing' | 'app' | 'privacy' | 'terms' | 'blog' | 'pricing' | 'auth' | 'articles') => void;
}

const PROMPTS = [
  "Ask AI to generate Luau scripts...",
  "Build a procedural dungeon generation script...",
  "Create a leaderstats system with coins...",
  "Script a custom tool with hit detection...",
  "Generate a DataStore saving module..."
];

export function LandingPage({ onEnterApp, onNavigate }: LandingPageProps) {
  const [input, setInput] = useState('');
  const [placeholderText, setPlaceholderText] = useState('');
  const [promptIndex, setPromptIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const { scrollY } = useScroll();
  const yImages = useTransform(scrollY, [0, 1000], [0, -400]);

  useEffect(() => {
    const currentPrompt = PROMPTS[promptIndex];
    
    let timer: NodeJS.Timeout;
    
    if (isDeleting) {
      if (charIndex > 0) {
        timer = setTimeout(() => {
          setCharIndex(prev => prev - 1);
          setPlaceholderText(currentPrompt.substring(0, charIndex - 1));
        }, 30);
      } else {
        setIsDeleting(false);
        setPromptIndex((prev) => (prev + 1) % PROMPTS.length);
      }
    } else {
      if (charIndex < currentPrompt.length) {
        timer = setTimeout(() => {
          setCharIndex(prev => prev + 1);
          setPlaceholderText(currentPrompt.substring(0, charIndex + 1));
        }, 70);
      } else {
        timer = setTimeout(() => setIsDeleting(true), 2000);
      }
    }
    
    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, promptIndex]);

  return (
    <div className="w-full min-h-screen bg-[#1c1c1c] text-white font-sans overflow-x-hidden selection:bg-neutral-800">

      {/* Dark Hero Section - Matching App Theme */}
      <div className="relative w-full min-h-screen flex flex-col overflow-hidden">
        
        {/* Background Images Overlay mimicking the screenshot - Now full screen width */}
        <motion.div style={{ y: yImages }} className="absolute inset-0 z-0 pointer-events-none opacity-[0.35]">
          <img src="https://res.cloudinary.com/dwthgcx5j/image/upload/v1787094724/NEON_DRIFT_X_game_cover_202605241419_fjybae.jpg" className="absolute top-[8%] left-[4%] w-48 h-32 object-cover rounded-xl -rotate-6 shadow-2xl" alt="NEON DRIFT X" />
          <img src="https://res.cloudinary.com/dwthgcx5j/image/upload/v1787094715/Blocky_Crossing_game_cover_202605241419_czbolu.jpg" className="absolute top-[10%] right-[6%] w-48 h-32 object-cover rounded-xl rotate-3 shadow-2xl" alt="Blocky Crossing" />
          <img src="https://res.cloudinary.com/dwthgcx5j/image/upload/v1787094715/Titan_Offroad_game_cover_202605241419_big2ck.jpg" className="absolute top-[6%] left-[38%] w-48 h-32 object-cover rounded-xl -rotate-3 shadow-2xl" alt="Titan Offroad" />
          <img src="https://res.cloudinary.com/dwthgcx5j/image/upload/v1787094701/Armored_muscle_cars_crashing_hig__202605241419_yqugg9.jpg" className="absolute bottom-[8%] left-[5%] w-48 h-32 object-cover rounded-xl rotate-6 shadow-2xl" alt="Armored muscle cars" />
          <img src="https://res.cloudinary.com/dwthgcx5j/image/upload/v1787094698/Cube_Clash.io_game_cover_202605241420_d4eaeg.jpg" className="absolute bottom-[10%] right-[5%] w-48 h-32 object-cover rounded-xl -rotate-2 shadow-2xl" alt="Cube Clash.io" />
          <img src="https://res.cloudinary.com/dwthgcx5j/image/upload/v1787094698/Shadow_Protocol_cover_art_202605241419_orggay.jpg" className="absolute bottom-[6%] left-[35%] w-48 h-32 object-cover rounded-xl rotate-3 shadow-2xl" alt="Shadow Protocol" />
          <img src="https://res.cloudinary.com/dwthgcx5j/image/upload/v1787094681/Flappy_Sky_game_cover_202605241419_to1erv.jpg" className="absolute top-[42%] left-[2%] w-48 h-32 object-cover rounded-xl -rotate-12 shadow-2xl" alt="Flappy Sky" />
          <img src="https://res.cloudinary.com/dwthgcx5j/image/upload/v1787094680/Frozen_Survival_game_cover_art_202605241420_ryf9df.jpg" className="absolute top-[45%] right-[2%] w-48 h-32 object-cover rounded-xl rotate-6 shadow-2xl" alt="Frozen Survival" />
          <img src="https://res.cloudinary.com/dwthgcx5j/image/upload/v1787094676/Zombie_District_game_cover_202605241419_iyozmx.jpg" className="absolute top-[40%] left-[65%] w-48 h-32 object-cover rounded-xl -rotate-6 shadow-2xl" alt="Zombie District" />
        </motion.div>

        {/* Nav */}
        <nav className="relative z-50 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-3">
            <div className="w-[34px] h-[34px] rounded-[32px] [corner-shape:squircle] flex items-center justify-center relative overflow-hidden bg-transparent">
              <img src="https://res.cloudinary.com/dwthgcx5j/image/upload/v1787673321/squircle-n4_abdl5u.png" alt="App Icon" className="w-full h-full object-cover" />
            </div>
            <span className="font-bold text-[18px] text-white tracking-tight whitespace-nowrap">Atmos orbit</span>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <button onClick={() => onNavigate?.('blog')} className="text-white/70 hover:text-white font-medium transition-colors">Blog</button>
            <button onClick={() => onNavigate?.('articles')} className="text-white/70 hover:text-white font-medium transition-colors">Articles</button>
            <button onClick={() => onNavigate?.('pricing')} className="text-white/70 hover:text-white font-medium transition-colors">Pricing</button>
            <div className="w-px h-4 bg-white/20"></div>
            <button onClick={() => onNavigate?.('auth')} className="text-white hover:text-white/80 font-medium transition-colors">Log in</button>
            <button 
              onClick={onEnterApp}
              className="bg-white hover:bg-neutral-200 text-black px-6 py-2.5 rounded-[32px] [corner-shape:squircle] font-bold transition-all"
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
            <div className="flex items-center gap-2 overflow-x-auto pb-1 px-1 scrollbar-none no-scrollbar justify-center cursor-default">
              {['Procedural Spawner', 'Obby Simulator', 'Day-Night Cycle', 'Laser Tag Arena'].map((preset, idx) => (
                <div
                  key={idx}
                  className="text-[13px] font-medium bg-[#2a2a2a]/50 backdrop-blur-xl text-white/90 px-4 py-2 rounded-[32px] [corner-shape:squircle] whitespace-nowrap shrink-0 flex items-center gap-1.5"
                >
                  <Sparkles size={14} className="text-white opacity-70" strokeWidth={2.5} /> {preset}
                </div>
              ))}
            </div>

            {/* Input Prompt Box */}
            <div className="w-full bg-[#2a2a2a]/50 backdrop-blur-xl rounded-[32px] [corner-shape:squircle] relative p-4 flex flex-col min-h-[140px] shadow-2xl border border-white/5">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={placeholderText}
                className="w-full flex-1 min-h-[60px] bg-transparent text-[#e0e0e0] px-2 py-2 text-[16px] focus:outline-none placeholder-neutral-500 resize-none font-medium flex items-center transition-colors"
                readOnly
              />
              <div className="flex items-center justify-between mt-2 px-1">
                <div className="flex items-center gap-2 text-neutral-500">
                  <div className="p-2 rounded-lg transition-colors opacity-50">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                  </div>
                </div>
                <div 
                  className={`w-9 h-9 rounded-[32px] [corner-shape:squircle] flex items-center justify-center transition-all duration-200 bg-[#3a3a3a] text-neutral-500`}
                >
                  <ArrowUp size={20} strokeWidth={2.5} />
                </div>
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
      <div className="relative w-full bg-gradient-to-b from-[#1c1c1c] to-[#0a0a0a] pt-24 pb-32 px-6 md:px-12 flex flex-col items-center z-20">
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
              className="bg-[#141414] hover:bg-[#181818] transition-colors rounded-[32px] [corner-shape:squircle] p-4 flex flex-col group"
            >
              {/* Graphic Area */}
              <div className="w-full h-56 bg-[#111] rounded-[40px] [corner-shape:squircle] mb-6 relative overflow-hidden">
                <img src="https://res.cloudinary.com/dwthgcx5j/image/upload/v1787179206/Abstract_gradient_background_202608191639_1_tqihzn.jpg" className="absolute inset-0 w-full h-full object-cover opacity-90" alt="Background" />
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* Floating Elements */}
                  <div className="w-36 h-40 bg-white/5 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] rounded-xl flex flex-col p-4 gap-3 relative -left-4">
                    <div className="w-1/3 h-2 bg-white/20 rounded-full"></div>
                    <div className="w-3/4 h-2 bg-white/10 rounded-full"></div>
                    <div className="w-2/3 h-2 bg-white/10 rounded-full"></div>
                    <div className="w-full h-2 bg-white/5 rounded-full mt-auto"></div>
                  </div>
                  <div className="absolute right-10 bottom-10 w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.5)] shadow-orange-500/20">
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

            {/* Feature 2: Full Studio Control */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="bg-[#141414] hover:bg-[#181818] transition-colors rounded-[32px] [corner-shape:squircle] p-4 flex flex-col group"
            >
              {/* Graphic Area */}
              <div className="w-full h-56 bg-[#111] rounded-[40px] [corner-shape:squircle] mb-6 relative overflow-hidden">
                <img src="https://res.cloudinary.com/dwthgcx5j/image/upload/v1787179183/Abstract_gradient_background_ble__202608191639_pqhfka.jpg" className="absolute inset-0 w-full h-full object-cover opacity-90" alt="Background" />
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* Floating Pill */}
                  <div className="w-48 h-14 bg-white/5 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] rounded-full flex items-center px-4 gap-4">
                    <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                      <Check size={14} className="text-black" strokeWidth={3} />
                    </div>
                    <div className="flex-1 h-2.5 bg-white/10 rounded-full"></div>
                  </div>
                </div>
              </div>
              {/* Text Area */}
              <h3 className="text-[22px] font-medium tracking-tight text-white mb-2 px-2">Full Studio Control</h3>
              <p className="text-[#8a8a8a] text-[15px] leading-relaxed mb-6 flex-1 px-2">
                Connect via secure PIN to push AI-generated scripts, build Terrain, design GUIs, execute CSG operations, manage DataStores, and run commands with full plugin-level permissions.
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
              className="bg-[#141414] hover:bg-[#181818] transition-colors rounded-[32px] [corner-shape:squircle] p-4 flex flex-col group"
            >
              {/* Graphic Area */}
              <div className="w-full h-56 bg-[#111] rounded-[40px] [corner-shape:squircle] mb-6 relative overflow-hidden">
                <img src="https://res.cloudinary.com/dwthgcx5j/image/upload/v1787179178/Abstract_gradient_background_202608191639_kyhqnu.jpg" className="absolute inset-0 w-full h-full object-cover opacity-90" alt="Background" />
                <div className="absolute inset-0 flex items-center justify-center pr-6">
                  {/* Floating Coins/Assets */}
                  <div className="flex -space-x-6">
                    {[3, 2, 1].map((i) => (
                      <div key={i} className={`w-16 h-16 bg-white/5 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] rounded-full flex items-center justify-center transform ${i===1 ? 'z-30 scale-110' : i===2 ? 'z-20 scale-100' : 'z-10 scale-90 opacity-70'}`}>
                        <Box size={24} className="text-rose-500" strokeWidth={2.5} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* Text Area */}
              <h3 className="text-[22px] font-medium tracking-tight text-white mb-2 px-2">Smart Asset Fetching</h3>
              <p className="text-[#8a8a8a] text-[15px] leading-relaxed mb-6 flex-1 px-2">
                Automatically search and integrate safe, free 3D models, audio, and decals from the Creator Marketplace into your builds.
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

      
      
            {/* Reviews Section */}
      <div className="relative w-full bg-[#0a0a0a] py-32 flex flex-col items-center z-20 overflow-hidden" style={{ backgroundImage: 'radial-gradient(#222 1.5px, transparent 1.5px)', backgroundSize: '32px 32px' }}>
        
        {/* Soft gradient fades on the sides for the carousel effect */}
        <div className="absolute inset-y-0 left-0 w-12 md:w-32 bg-gradient-to-r from-[#0a0a0a] to-transparent pointer-events-none z-10"></div>
        <div className="absolute inset-y-0 right-0 w-12 md:w-32 bg-gradient-to-l from-[#0a0a0a] to-transparent pointer-events-none z-10"></div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-16 text-center relative z-20 px-6"
        >
          <h2 className="text-[32px] md:text-[40px] font-mono tracking-tight text-white mb-3">
            What creators are saying.
          </h2>
        </motion.div>

        {/* Horizontal Auto-Scrolling Marquee */}
        <div className="w-full overflow-hidden relative z-20 pb-8">
          <style>{`
            @keyframes marquee {
              0% { transform: translateX(0%); }
              100% { transform: translateX(calc(-50% - 12px)); }
            }
            .animate-marquee {
              animation: marquee 35s linear infinite;
              display: flex;
              width: max-content;
            }
            .animate-marquee:hover {
              animation-play-state: paused;
            }
          `}</style>
          
          <div className="animate-marquee gap-6 px-6">
            {[...[
            {
              text: "The Live Studio Sync feature is incredible. I generated a full inventory system and pushed it straight into my game without touching a single script.",
              name: "Mateo Velázquez",
              handle: "@mateo_dev",
              color: "bg-blue-600"
            },
            {
              text: "I used to spend hours looking for safe audio and models. The Smart Asset Fetching just pulls exactly what I need directly from the Creator Marketplace.",
              name: "Priya Sharma",
              handle: "@priyabuilds",
              color: "bg-rose-600"
            },
            {
              text: "Surgical code edits are a game changer. It fixes my Luau bugs without rewriting the entire module. Saves me so much time.",
              name: "Caleb Henderson",
              handle: "@caleb_rblx",
              color: "bg-emerald-600"
            },
            {
              text: "Atmos Orbit helped me build my first tycoon in a weekend. The code it writes is clean and actually follows Roblox best practices.",
              name: "Valeria Castillo",
              handle: "@valca_dev",
              color: "bg-amber-600"
            },
            {
              text: "Finally an AI that understands how RemoteEvents and DataStores should be structured. Best tool for Roblox developers right now.",
              name: "Rohan Desai",
              handle: "@rohand_dev",
              color: "bg-purple-600"
            }
          ], ...[
            {
              text: "The Live Studio Sync feature is incredible. I generated a full inventory system and pushed it straight into my game without touching a single script.",
              name: "Mateo Velázquez",
              handle: "@mateo_dev",
              color: "bg-blue-600"
            },
            {
              text: "I used to spend hours looking for safe audio and models. The Smart Asset Fetching just pulls exactly what I need directly from the Creator Marketplace.",
              name: "Priya Sharma",
              handle: "@priyabuilds",
              color: "bg-rose-600"
            },
            {
              text: "Surgical code edits are a game changer. It fixes my Luau bugs without rewriting the entire module. Saves me so much time.",
              name: "Caleb Henderson",
              handle: "@caleb_rblx",
              color: "bg-emerald-600"
            },
            {
              text: "Atmos Orbit helped me build my first tycoon in a weekend. The code it writes is clean and actually follows Roblox best practices.",
              name: "Valeria Castillo",
              handle: "@valca_dev",
              color: "bg-amber-600"
            },
            {
              text: "Finally an AI that understands how RemoteEvents and DataStores should be structured. Best tool for Roblox developers right now.",
              name: "Rohan Desai",
              handle: "@rohand_dev",
              color: "bg-purple-600"
            }
          ]].map((review, index) => (
              <div 
                key={index}
                className="w-[85vw] md:w-[400px] bg-[#111111] hover:bg-[#141414] transition-colors rounded-[32px] [corner-shape:squircle] p-8 flex flex-col justify-between shrink-0 border border-transparent cursor-pointer"
              >
                <p className="text-[#e0e0e0] text-[16px] leading-relaxed mb-10 font-medium">
                  "{review.text}"
                </p>
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full ${review.color} flex items-center justify-center overflow-hidden text-white font-bold text-[14px] shadow-lg`}>
                    {review.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white font-medium text-[15px]">{review.name}</span>
                    <span className="text-[#8a8a8a] text-[13px] font-mono">{review.handle}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="relative w-full bg-black py-32 px-6 md:px-12 flex flex-col items-center z-20">
        <div className="w-full max-w-[840px] mx-auto">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-16 text-center"
          >
            <h2 className="text-[36px] md:text-[48px] font-semibold tracking-tight text-white mb-4">
              Frequently asked questions
            </h2>
            <p className="text-[#8a8a8a] text-[18px]">
              Everything you need to know about building with Atmos Orbit.
            </p>
          </motion.div>

          <div className="flex flex-col gap-4">
            {[
              {
                q: "Does this work with my existing Roblox games?",
                a: "Yes! Atmos Orbit integrates seamlessly into your current Roblox Studio workflow. You can easily insert new AI-generated systems or modify existing scripts without breaking your game's structure."
              },
              {
                q: "How does the Live Studio Sync work?",
                a: "We provide a secure, lightweight Roblox Studio plugin. By entering the 6-digit PIN from your Atmos Orbit dashboard, your web workspace securely bridges directly to your live Studio session to push code and assets instantly."
              },
              {
                q: "Are the generated scripts optimized for Luau?",
                a: "Absolutely. Our engine is specifically fine-tuned for Roblox's Luau environment, producing highly performant, server-client authoritative code that follows standard DataModel architectures and best practices."
              },
              {
                q: "Can I fetch custom 3D models and UI?",
                a: "Yes! Our Smart Asset Fetching lets you query the Creator Marketplace directly through conversational prompts. It automatically finds safe, high-quality models, sounds, and UI elements and places them into your workspace."
              },
              {
                q: "What can the AI control inside Roblox Studio?",
                a: "Our AI engine executes with full plugin-level permissions. Beyond just writing scripts, it can procedurally generate Terrain, carve parts using CSG (Solid Modeling), design fully functional ScreenGuis, configure Lighting/Atmosphere, rig Physics constraints, map Pathfinding routes, create Animations, manage DataStores, and generate Custom Materials/PBR Textures."
              }
            ].map((faq, index) => {
              const [isOpen, setIsOpen] = React.useState(false);
              return (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="w-full"
                >
                  <div className="bg-[#111111] rounded-[32px] [corner-shape:squircle] overflow-hidden transition-colors hover:bg-[#161616]">
                    <button
                      onClick={() => setIsOpen(!isOpen)}
                      className="w-full px-8 py-6 flex items-center justify-between text-left focus:outline-none"
                    >
                      <span className="text-[18px] font-medium text-white/95">{faq.q}</span>
                      <motion.div
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="text-white/40 flex-shrink-0 ml-4"
                      >
                        <Plus size={22} strokeWidth={2} />
                      </motion.div>
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                          <div className="px-8 pb-8 pt-2 text-[#8a8a8a] text-[16px] leading-relaxed">
                            {faq.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Cinematic CTA Section */}
      <div className="relative w-full bg-black py-32 md:py-48 flex flex-col items-start justify-center overflow-hidden z-20">
        
        {/* Deep Space / Planet Background */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {/* Earth Horizon Image */}
          <img 
            src="https://res.cloudinary.com/dwthgcx5j/image/upload/v1787165315/ChatGPT_Image_Aug_19_2026_12_47_35_PM_p1cbjp.png" 
            alt="Space Horizon" 
            className="absolute inset-0 w-full h-full object-cover object-[right_center]"
          />
          {/* Gradients to fade edges into pure black, adjusted for readability but less blur */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent w-[70%]"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-[#0a0a0a] opacity-90"></div>
        </div>

        <div className="w-full max-w-[1200px] mx-auto px-6 md:px-12 relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-start"
          >
            <h2 className="text-[56px] md:text-[80px] lg:text-[96px] font-bold tracking-tight text-white leading-[1.05] mb-12 drop-shadow-2xl">
              What game will<br/>
              you build?
            </h2>
            
            <div className="flex items-center gap-8">
              <button 
                onClick={onEnterApp}
                className="bg-white hover:bg-neutral-200 text-black px-8 py-3.5 rounded-[32px] [corner-shape:squircle] font-semibold text-[17px] transition-transform hover:scale-105 active:scale-95 shadow-xl"
              >
                Start building for free
              </button>
              <button 
                onClick={onEnterApp}
                className="text-white/90 hover:text-white font-medium text-[17px] transition-colors"
              >
                Connect to Studio
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer (Dark Mode) */}
      <footer className="w-full bg-[#0a0a0a] pt-16 pb-12 px-8 flex flex-col z-40 relative">
        <div className="max-w-[1200px] mx-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 relative">
            
            <div className="col-span-1 md:col-span-2 flex items-start gap-3 text-white">
              <div className="w-[34px] h-[34px] rounded-[32px] [corner-shape:squircle] flex items-center justify-center relative overflow-hidden bg-transparent">
                <img src="https://res.cloudinary.com/dwthgcx5j/image/upload/v1787673321/squircle-n4_abdl5u.png" alt="App Icon" className="w-full h-full object-cover" />
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
              <button onClick={() => onNavigate?.('privacy')} className="text-[#8a8a8a] hover:text-white font-medium transition-colors text-[14px] text-left">Privacy Policy</button>
              <button onClick={() => onNavigate?.('terms')} className="text-[#8a8a8a] hover:text-white font-medium transition-colors text-[14px] text-left">Terms of Service</button>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 text-[13px] text-[#666] font-medium">
            © Atmos Orbit Labs, Inc.
          </div>
        </div>
      </footer>
    </div>
  );
}
