const fs = require('fs');

const blogCode = `import React, { useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

interface BlogPageProps {
  onNavigate: (view: 'landing' | 'app' | 'privacy' | 'terms' | 'blog' | 'pricing') => void;
}

export function BlogPage({ onNavigate }: BlogPageProps) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#000000] text-white font-sans selection:bg-neutral-800">
      
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 bg-[#000000]/80 backdrop-blur-md border-b border-white/5">
        <button 
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 rounded-lg flex items-center justify-center relative overflow-hidden bg-transparent">
            <img src="https://res.cloudinary.com/dwthgcx5j/image/upload/v1787020978/rounded-image_1_q5ruom.png" alt="App Icon" className="w-full h-full object-cover" />
          </div>
          <span className="font-bold text-[16px] text-white tracking-tight">Atmos orbit</span>
        </button>
        
        <button 
          onClick={() => onNavigate('app')}
          className="text-[14px] font-medium text-white/70 hover:text-white transition-colors"
        >
          Dashboard
        </button>
      </nav>

      {/* Main Blog Content */}
      <main className="max-w-[720px] mx-auto px-6 pt-32 pb-32">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-[13px] text-[#606060] mb-8 font-medium">
          <button onClick={() => onNavigate('landing')} className="hover:text-white transition-colors">Home</button>
          <ChevronRight size={12} />
          <span className="text-white/70">Engineering Blog</span>
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <h1 className="text-[36px] md:text-[48px] font-semibold tracking-tight text-[#f5f5f5] leading-[1.15] mb-6">
            How we reduced Luau hallucination rates by 18% in Atmos Orbit v2
          </h1>

          {/* Meta Info */}
          <div className="flex flex-col gap-3 mb-10">
            <span className="text-[13px] text-[#8a8a8a] font-medium tracking-wide">12 min read</span>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full overflow-hidden bg-[#222]">
                <img src="https://res.cloudinary.com/dwthgcx5j/image/upload/v1787020978/rounded-image_1_q5ruom.png" alt="Author" className="w-full h-full object-cover" />
              </div>
              <span className="text-[14px] text-[#a0a0a0] font-medium">Atmoslabs</span>
            </div>
          </div>
        </motion.div>

        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
        >
          <div className="w-full h-[250px] md:h-[400px] rounded-2xl overflow-hidden mb-12 border border-white/5 bg-[#111]">
            <img 
              src="https://res.cloudinary.com/dwthgcx5j/image/upload/v1787179206/Abstract_gradient_background_202608191639_1_tqihzn.jpg" 
              alt="Abstract representation of code processing" 
              className="w-full h-full object-cover opacity-90"
            />
          </div>
        </motion.div>

        {/* Article Content */}
        <motion.article 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="prose prose-invert max-w-none"
        >
          <p className="text-[18px] md:text-[20px] text-[#d0d0d0] leading-[1.7] mb-10 font-medium">
            When we started the Atmos Orbit v2 research cycle, the clearest signal from our beta users was consistent: generated Luau scripts were excellent for straightforward tasks but degraded noticeably when managing complex, multi-module game architectures.
          </p>

          <h2 className="text-[26px] md:text-[30px] font-semibold text-[#f5f5f5] mt-16 mb-6 tracking-tight">
            Where the problem actually lived
          </h2>
          
          <p className="text-[16px] text-[#a0a0a0] leading-[1.8] mb-6">
            Our initial hypothesis was temperature-related. Lowering it should reduce randomness and therefore reduce hallucination. It did not. Lower temperature produced more consistent outputs but not more accurate ones — the model would simply commit to a wrong structural pattern more firmly.
          </p>
          
          <p className="text-[16px] text-[#a0a0a0] leading-[1.8] mb-6">
            The real issue was in how the model weighted context during reasoning. In multi-module Roblox projects, the model was placing too much weight on the first ReplicatedStorage module it encountered and not sufficiently re-evaluating that weight as it processed subsequent client-server boundaries.
          </p>

          <p className="text-[16px] text-[#a0a0a0] leading-[1.8] mb-6">
            Unlike standard web development, Roblox operates on a strict DataModel hierarchy (ServerScriptService vs. StarterPlayerScripts) bridged by RemoteEvents and RemoteFunctions. When an AI generates code for a single file without maintaining a continuous map of the broader DataModel, it tends to invent RemoteEvents that haven't been instantiated, or worse, attempts to call DataStoreService from a LocalScript.
          </p>

          <h2 className="text-[26px] md:text-[30px] font-semibold text-[#f5f5f5] mt-16 mb-6 tracking-tight">
            Rethinking the Client-Server Boundary
          </h2>

          <p className="text-[16px] text-[#a0a0a0] leading-[1.8] mb-6">
            To solve this, we had to rethink how context is fed to the underlying Large Language Model. We introduced a technique we call "Hierarchical Context Anchoring". Before a single line of Luau is generated, the Atmos Orbit engine performs a lightweight read of the user's active Studio session via our plugin.
          </p>

          <p className="text-[16px] text-[#a0a0a0] leading-[1.8] mb-6">
            This read creates a structural map—essentially a minified JSON representation of the game's ReplicatedStorage and ServerScriptService structure. This map is then permanently anchored to the top of the LLM's context window. Instead of guessing where the \`GameData\` module lives, the model *knows* it is located at \`ReplicatedStorage.Shared.Modules.GameData\`.
          </p>
          
          <p className="text-[16px] text-[#a0a0a0] leading-[1.8] mb-6">
            Furthermore, we fine-tuned our engine on thousands of high-quality, open-source Rojo projects. This taught the model to naturally gravitate toward modern Luau patterns: using strict typing, preferring \`task.wait()\` over \`wait()\`, and properly cleaning up connections using Janitor or Trove patterns.
          </p>

          <h2 className="text-[26px] md:text-[30px] font-semibold text-[#f5f5f5] mt-16 mb-6 tracking-tight">
            The results
          </h2>

          <p className="text-[16px] text-[#a0a0a0] leading-[1.8] mb-6">
            By implementing this dual-pass evaluation step—where the engine first maps the DataModel structure before generating any logical routines—we saw an immediate 18% drop in structural hallucinations. Scripts no longer assumed the existence of uninstantiated RemoteEvents.
          </p>

          <p className="text-[16px] text-[#a0a0a0] leading-[1.8] mb-6">
            This architectural shift is now live for all users on the v2 engine. You can experience the difference immediately when generating complex UI controllers, interacting with DataStore wraps, or scaffolding new game loops.
          </p>
          
          <div className="mt-16 p-8 bg-[#111111] border border-white/5 rounded-2xl">
            <h3 className="text-white font-medium text-[18px] mb-2">Ready to try it out?</h3>
            <p className="text-[#8a8a8a] text-[15px] mb-6">Experience the most accurate Luau generation available for Roblox Studio.</p>
            <button onClick={() => onNavigate('app')} className="px-6 py-3 bg-white text-black font-semibold rounded-full text-[15px] hover:bg-neutral-200 transition-colors">
              Open Dashboard
            </button>
          </div>
        </motion.article>

      </main>
    </div>
  );
}
`;
fs.writeFileSync('src/components/BlogPage.tsx', blogCode);
