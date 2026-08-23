const fs = require('fs');
let code = fs.readFileSync('src/components/LandingPage.tsx', 'utf8');

const startIdx = code.indexOf('{/* Cinematic CTA Section */}');
const endIdx = code.indexOf('{/* Footer (Dark Mode) */}');

if (startIdx !== -1 && endIdx !== -1) {
  const oldCTA = code.substring(startIdx, endIdx);
  
  const newCTA = `{/* Cinematic CTA Section */}
      <div className="relative w-full bg-black py-32 md:py-48 flex flex-col items-start justify-center overflow-hidden z-20 border-t border-white/5">
        
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
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-90"></div>
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
                className="bg-white hover:bg-neutral-200 text-black px-8 py-3.5 rounded-full font-semibold text-[17px] transition-transform hover:scale-105 active:scale-95 shadow-xl"
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
      </div>\n\n      `;
      
  code = code.replace(oldCTA, newCTA);
  fs.writeFileSync('src/components/LandingPage.tsx', code);
  console.log("Patched CTA section successfully.");
} else {
  console.log("Could not find CTA block boundaries.");
}
