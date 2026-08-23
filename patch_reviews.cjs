const fs = require('fs');
let code = fs.readFileSync('src/components/LandingPage.tsx', 'utf8');

if (!code.includes('What creators are saying.')) {
  const reviewsSection = `      {/* Reviews Section */}
      <div className="relative w-full bg-[#0a0a0a] py-32 flex flex-col items-center z-20 overflow-hidden border-t border-white/5" style={{ backgroundImage: 'radial-gradient(#222 1.5px, transparent 1.5px)', backgroundSize: '32px 32px' }}>
        
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

        {/* Horizontal Scroll Container */}
        <div 
          className="w-full flex overflow-x-auto gap-6 px-12 md:px-32 pb-8 snap-x snap-mandatory relative z-20" 
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <style>{\`
            .no-scrollbar::-webkit-scrollbar {
              display: none;
            }
          \`}</style>
          
          {[
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
          ].map((review, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
              className="min-w-[85vw] md:min-w-[400px] max-w-[400px] bg-[#111111] hover:bg-[#141414] transition-colors rounded-[24px] p-8 flex flex-col justify-between snap-center shrink-0 no-scrollbar border border-transparent"
            >
              <p className="text-[#e0e0e0] text-[16px] leading-relaxed mb-10 font-medium">
                "{review.text}"
              </p>
              <div className="flex items-center gap-4">
                <div className={\`w-10 h-10 rounded-full \${review.color} flex items-center justify-center overflow-hidden text-white font-bold text-[14px] shadow-lg\`}>
                  {review.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-medium text-[15px]">{review.name}</span>
                  <span className="text-[#8a8a8a] text-[13px] font-mono">{review.handle}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>\n\n`;

  code = code.replace('{/* FAQ Section */}', reviewsSection + '      {/* FAQ Section */}');
  fs.writeFileSync('src/components/LandingPage.tsx', code);
  console.log("Patched reviews");
} else {
  console.log("Reviews already present");
}
