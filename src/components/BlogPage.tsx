import React, { useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

interface BlogPageProps {
  onNavigate: (view: 'landing' | 'app' | 'privacy' | 'terms' | 'blog' | 'pricing' | 'auth') => void;
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
            Meet the AI Orchestrator, Custom Models, and Gemini 3.1 Pro Preview
          </h1>

          {/* Meta Info */}
          <div className="flex flex-col gap-3 mb-10">
            <span className="text-[13px] text-[#8a8a8a] font-medium tracking-wide">August 20, 2026 • 5 min read</span>
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
            Today we are rolling out a massive update to the Atmos Orbit engine. Based on feedback from our community, we've completely overhauled how AI model routing is handled, added full support for custom endpoints, and integrated Google's latest reasoning models into the core experience.
          </p>

          <h2 className="text-[26px] md:text-[30px] font-semibold text-[#f5f5f5] mt-16 mb-6 tracking-tight">
            The AI Orchestrator
          </h2>
          
          <p className="text-[16px] text-[#a0a0a0] leading-[1.8] mb-6">
            Previously, you had to manually select which model to use. If you were doing heavy architectural work, you wanted a pro-level reasoning model. If you just wanted to spawn a basic part or say hello, a large model was overkill and slow. 
          </p>
          
          <p className="text-[16px] text-[#a0a0a0] leading-[1.8] mb-6">
            Enter the <strong>AI Orchestrator</strong>. When enabled in your AI Settings, VibeCoder uses a lightning-fast router (powered by Gemini 3.5 Flash-Lite) to analyze your prompt instantly. It dynamically routes complex logic and full-system architecture requests to <code>gemini-3.1-pro-preview</code>, standard Luau coding to <code>gemini-3.5-flash</code>, and simple questions right back to the ultra-fast <code>flash-lite</code> model. You get elite reasoning when you need it, and instant feedback when you don't.
          </p>

          <h2 className="text-[26px] md:text-[30px] font-semibold text-[#f5f5f5] mt-16 mb-6 tracking-tight">
            Bring Your Own Models (BYOM)
          </h2>

          <p className="text-[16px] text-[#a0a0a0] leading-[1.8] mb-6">
            We know many of our power users are fine-tuning their own Luau models or using enterprise proxies. You can now add completely custom models in the settings by defining a specific Model ID, Base URL, and override API Key. 
          </p>

          <p className="text-[16px] text-[#a0a0a0] leading-[1.8] mb-6">
            Whether you want to connect to a local development endpoint or an OpenAI-compatible proxy, Atmos Orbit will pass all context, including the live state of your Roblox Studio session, right into your custom pipeline.
          </p>

          <h2 className="text-[26px] md:text-[30px] font-semibold text-[#f5f5f5] mt-16 mb-6 tracking-tight">
            Fun details: The 3D Send Button
          </h2>

          <p className="text-[16px] text-[#a0a0a0] leading-[1.8] mb-6">
            We didn't just work on the backend today. Head over to <strong>Settings &gt; Appearance</strong> and you'll find a new toggle for the "3D Send Button." We added this playful, tactile drop-shadow effect for those who want their UI to have a bit more pop and physical feedback.
          </p>
          
          <div className="mt-16 p-8 bg-[#111111] border border-white/5 rounded-2xl">
            <h3 className="text-white font-medium text-[18px] mb-2">Ready to try the orchestrator?</h3>
            <p className="text-[#8a8a8a] text-[15px] mb-6">Experience intelligent model routing and elite Luau generation.</p>
            <button onClick={() => onNavigate('app')} className="px-6 py-3 bg-white text-black font-semibold rounded-full text-[15px] hover:bg-neutral-200 transition-colors">
              Open Dashboard
            </button>
          </div>
        </motion.article>

      </main>
    </div>
  );
}
