const fs = require('fs');
let code = fs.readFileSync('src/components/LandingPage.tsx', 'utf8');

const ctaSection = `
      {/* Cinematic CTA Section */}
      <div className="relative w-full bg-black py-32 md:py-48 flex flex-col items-start justify-center overflow-hidden z-20 border-t border-white/5">
        
        {/* Deep Space / Planet Background */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {/* Earth Horizon Image */}
          <img 
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop" 
            alt="Space Horizon" 
            className="w-full h-full object-cover object-[center_60%] opacity-40 mix-blend-screen"
          />
          {/* Gradients to fade edges into pure black */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black"></div>
          <div className="absolute inset-0 bg-black/20"></div>
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
              What will<br/>
              you discover?
            </h2>
            
            <div className="flex items-center gap-8">
              <button 
                onClick={onEnterApp}
                className="bg-white hover:bg-neutral-200 text-black px-8 py-3.5 rounded-full font-semibold text-[17px] transition-transform hover:scale-105 active:scale-95 shadow-xl"
              >
                Get started for free
              </button>
              <button 
                onClick={onEnterApp}
                className="text-white/90 hover:text-white font-medium text-[17px] transition-colors"
              >
                Book a Demo
              </button>
            </div>
          </motion.div>
        </div>
      </div>
`;

code = code.replace('{/* Footer (Dark Mode) */}', ctaSection + '\n      {/* Footer (Dark Mode) */}');
fs.writeFileSync('src/components/LandingPage.tsx', code);
console.log("Patched CTA section");
