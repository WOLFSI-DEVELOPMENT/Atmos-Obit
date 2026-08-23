const fs = require('fs');
let code = fs.readFileSync('src/components/LandingPage.tsx', 'utf8');

const reviewsArray = `[
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
          ]`;

const oldScrollContainer = code.substring(
  code.indexOf('{/* Horizontal Scroll Container */}'),
  code.indexOf('{/* FAQ Section */}')
);

const newScrollContainer = `{/* Horizontal Auto-Scrolling Marquee */}
        <div className="w-full overflow-hidden relative z-20 pb-8">
          <style>{\`
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
          \`}</style>
          
          <div className="animate-marquee gap-6 px-6">
            {[...${reviewsArray}, ...${reviewsArray}].map((review, index) => (
              <div 
                key={index}
                className="w-[85vw] md:w-[400px] bg-[#111111] hover:bg-[#141414] transition-colors rounded-[24px] p-8 flex flex-col justify-between shrink-0 border border-transparent cursor-pointer"
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
              </div>
            ))}
          </div>
        </div>
      </div>

      `;

if (oldScrollContainer) {
  code = code.replace(oldScrollContainer, newScrollContainer);
  fs.writeFileSync('src/components/LandingPage.tsx', code);
  console.log('Patched reviews to auto move marquee');
} else {
  console.log('Could not find reviews container');
}
