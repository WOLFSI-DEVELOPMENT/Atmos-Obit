const fs = require('fs');
let code = fs.readFileSync('src/components/LandingPage.tsx', 'utf8');

const targetStr = `      {/* Business Section */}
      <div className="relative w-full py-24 bg-[#f8f9fa] overflow-hidden" style={{ backgroundImage: 'radial-gradient(#e5e7eb 2px, transparent 2px)', backgroundSize: '40px 40px' }}>
        
        <div className="text-center relative z-10 mb-16">
          <h2 className="text-5xl md:text-7xl font-black text-black uppercase tracking-tighter drop-shadow-sm">
            Your first business
          </h2>
          <div className="inline-block mt-2 relative">
            <span className="bg-black text-white text-5xl md:text-7xl font-black uppercase tracking-tighter px-8 py-2 rounded-full shadow-xl">
              Starts here
            </span>
            {/* 3D Robux-like icon placeholder */}
            <div className="absolute -right-12 -bottom-6 text-6xl text-cyan-400 drop-shadow-2xl rotate-12 font-black italic">
              $
            </div>
          </div>
        </div>

        {/* Sticky Notes */}
        <div className="absolute top-20 left-[10%] md:left-[20%] w-40 h-40 bg-yellow-300 p-4 shadow-xl -rotate-6 handwritten text-lg font-bold text-neutral-800 leading-tight">
          ideas for<br/>Roblox game
        </div>
        <div className="absolute top-48 left-[5%] md:left-[15%] w-40 h-40 bg-yellow-400 p-4 shadow-xl -rotate-12 handwritten text-lg font-bold text-neutral-800 flex flex-col justify-center">
          &lt;username&gt;<br/>786k visits
        </div>
        <div className="absolute top-32 right-[10%] md:right-[20%] w-40 h-40 bg-yellow-300 p-4 shadow-xl rotate-12 handwritten text-lg font-bold text-neutral-800">
          Make alot<br/>$$$$$$$$$
        </div>

        {/* Conveyor Belt */}
        <div className="w-full h-32 bg-gradient-to-b from-neutral-700 to-neutral-900 mt-20 relative border-y-8 border-neutral-400 shadow-2xl flex items-center overflow-hidden">
           {/* Belt Texture */}
           <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #000 10px, #000 20px)' }}></div>
           
           {/* Moving Gems */}
           <div 
             className="flex items-center gap-32 whitespace-nowrap relative z-10"
             style={{ transform: \`translateX(-\${offset}%)\` }}
           >
             {[...Array(20)].map((_, i) => (
                <div key={i} className="w-16 h-16 bg-cyan-400 rounded-full border-4 border-cyan-200 shadow-[0_0_20px_rgba(34,211,238,0.6)] flex items-center justify-center shrink-0">
                  <div className="w-8 h-8 bg-cyan-100 rounded-full opacity-80"></div>
                </div>
             ))}
           </div>

           {/* Rivets */}
           <div className="absolute top-2 left-10 w-3 h-3 bg-neutral-300 rounded-full shadow-inner"></div>
           <div className="absolute top-2 left-1/2 w-3 h-3 bg-neutral-300 rounded-full shadow-inner"></div>
           <div className="absolute top-2 right-10 w-3 h-3 bg-neutral-300 rounded-full shadow-inner"></div>
           
           <div className="absolute bottom-2 left-32 w-3 h-3 bg-neutral-300 rounded-full shadow-inner"></div>
           <div className="absolute bottom-2 right-32 w-3 h-3 bg-neutral-300 rounded-full shadow-inner"></div>
        </div>
      </div>`;

const replacementStr = `      {/* Business Section */}
      <div className="relative w-full pt-32 pb-0 bg-[#f8f9fa] overflow-hidden flex flex-col items-center" style={{ backgroundImage: 'radial-gradient(#e5e7eb 2px, transparent 2px)', backgroundSize: '40px 40px' }}>
        
        <div className="text-center relative z-10 mb-24 w-full max-w-5xl">
          <h2 className="text-6xl md:text-8xl lg:text-[7.5rem] leading-[0.9] font-black text-black uppercase tracking-tighter drop-shadow-sm">
            Your first business
          </h2>
          <div className="inline-block mt-2 relative">
            <span className="bg-black text-white text-6xl md:text-8xl lg:text-[7.5rem] leading-[1] font-black uppercase tracking-tighter px-10 py-3 rounded-[2.5rem] shadow-2xl inline-block transform -rotate-1">
              Starts here
            </span>
            {/* 3D Robux-like icon placeholder */}
            <div className="absolute -right-16 -bottom-8 text-8xl text-cyan-400 drop-shadow-[0_10px_20px_rgba(34,211,238,0.4)] rotate-12 font-black italic">
              $
            </div>
          </div>
        </div>

        {/* Sticky Notes */}
        <div className="absolute top-24 left-[5%] md:left-[12%] w-56 h-56 bg-yellow-300 p-6 shadow-[10px_15px_30px_rgba(0,0,0,0.15)] -rotate-6 handwritten text-2xl font-bold text-neutral-800 leading-tight transition-transform hover:scale-105 hover:-rotate-3 z-20">
          <div className="absolute top-[-15px] left-1/2 -translate-x-1/2 w-24 h-8 bg-white/40 rotate-2"></div>
          ideas for<br/>Roblox game
        </div>
        <div className="absolute top-64 left-[-2%] md:left-[5%] w-60 h-60 bg-yellow-400 p-6 shadow-[5px_20px_35px_rgba(0,0,0,0.2)] -rotate-12 handwritten text-2xl font-bold text-neutral-800 flex flex-col justify-center z-10 transition-transform hover:scale-105 hover:-rotate-6">
          <div className="absolute top-[-10px] left-1/3 w-20 h-8 bg-white/40 -rotate-3"></div>
          &lt;username&gt;<br/>786k visits
        </div>
        <div className="absolute top-36 right-[2%] md:right-[10%] w-64 h-64 bg-yellow-300 p-6 shadow-[15px_20px_40px_rgba(0,0,0,0.15)] rotate-12 handwritten text-3xl font-bold text-neutral-800 flex flex-col justify-center z-20 transition-transform hover:scale-105 hover:rotate-6">
          <div className="absolute top-[-12px] right-1/4 w-28 h-8 bg-white/40 rotate-6"></div>
          Make alot<br/>$$$$$$$$$
        </div>

        {/* Conveyor Belt */}
        <div className="w-[110%] h-48 bg-gradient-to-b from-neutral-800 to-black mt-16 relative border-t-[12px] border-b-[16px] border-neutral-400 shadow-[0_-20px_50px_rgba(0,0,0,0.3)] flex items-center overflow-hidden transform rotate-0 z-30">
           {/* Inner metallic track */}
           <div className="absolute inset-y-0 inset-x-0 border-y-8 border-neutral-600/50 pointer-events-none z-20"></div>
           
           {/* Belt Texture */}
           <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'repeating-linear-gradient(60deg, transparent, transparent 15px, #000 15px, #000 30px)' }}></div>
           
           {/* Moving Gems */}
           <div 
             className="flex items-center gap-40 whitespace-nowrap relative z-10"
             style={{ transform: \`translateX(-\${offset}%)\` }}
           >
             {[...Array(20)].map((_, i) => (
                <div key={i} className="w-24 h-24 bg-cyan-400 rounded-full border-8 border-cyan-200 shadow-[0_0_40px_rgba(34,211,238,0.8),inset_0_10px_20px_rgba(255,255,255,0.5)] flex items-center justify-center shrink-0">
                  <div className="w-12 h-12 bg-cyan-100 rounded-full shadow-[inset_0_-5px_10px_rgba(0,0,0,0.2)]"></div>
                </div>
             ))}
           </div>

           {/* Rivets Top */}
           <div className="absolute top-2 left-[10%] w-4 h-4 bg-neutral-300 rounded-full shadow-[inset_0_-2px_4px_rgba(0,0,0,0.5)] z-30"></div>
           <div className="absolute top-2 left-[30%] w-4 h-4 bg-neutral-300 rounded-full shadow-[inset_0_-2px_4px_rgba(0,0,0,0.5)] z-30"></div>
           <div className="absolute top-2 left-[50%] w-4 h-4 bg-neutral-300 rounded-full shadow-[inset_0_-2px_4px_rgba(0,0,0,0.5)] z-30"></div>
           <div className="absolute top-2 left-[70%] w-4 h-4 bg-neutral-300 rounded-full shadow-[inset_0_-2px_4px_rgba(0,0,0,0.5)] z-30"></div>
           <div className="absolute top-2 left-[90%] w-4 h-4 bg-neutral-300 rounded-full shadow-[inset_0_-2px_4px_rgba(0,0,0,0.5)] z-30"></div>
           
           {/* Rivets Bottom */}
           <div className="absolute bottom-2 left-[20%] w-4 h-4 bg-neutral-300 rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] z-30"></div>
           <div className="absolute bottom-2 left-[40%] w-4 h-4 bg-neutral-300 rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] z-30"></div>
           <div className="absolute bottom-2 left-[60%] w-4 h-4 bg-neutral-300 rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] z-30"></div>
           <div className="absolute bottom-2 left-[80%] w-4 h-4 bg-neutral-300 rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] z-30"></div>
        </div>
      </div>`;

if (code.includes(targetStr)) {
    code = code.replace(targetStr, replacementStr);
    fs.writeFileSync('src/components/LandingPage.tsx', code);
    console.log("Patched Business section correctly");
} else {
    console.log("Could not find target string.");
}
