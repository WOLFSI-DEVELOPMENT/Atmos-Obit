const fs = require('fs');
let code = fs.readFileSync('src/components/PricingPage.tsx', 'utf8');

// Update Grid width and gap
code = code.replace(
  'className="grid md:grid-cols-3 gap-6 max-w-[1050px] mx-auto items-start"',
  'className="grid md:grid-cols-3 gap-8 max-w-[1200px] mx-auto items-start"'
);

// Update Pricing Pill
code = code.replace(
  'className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 text-[14px] font-medium mb-6 border border-indigo-500/20"',
  'className="inline-flex items-center gap-2 px-4 py-1.5 rounded-[55px] [corner-shape:squircle] bg-[#020617] text-indigo-400 text-[14px] font-medium mb-6 border border-[#1e1b4b]"'
);

// Update Toggle buttons
code = code.replace(/rounded-full/g, 'rounded-[55px] [corner-shape:squircle]');

// Free Tier Card
code = code.replace(
  'className="bg-[#0a0a0a] rounded-[32px] p-10 flex flex-col border border-white/10 mt-0 md:mt-12"',
  'className="bg-[#111111] rounded-[55px] [corner-shape:squircle] p-10 flex flex-col mt-0 md:mt-12"'
);

// Premium Outer Wrapper
code = code.replace(
  'className="bg-[#151525] border border-indigo-500/30 rounded-[36px] flex flex-col p-2 relative shadow-[0_0_40px_rgba(99,102,241,0.08)]"',
  'className="bg-[#151525] border border-indigo-500/30 rounded-[55px] [corner-shape:squircle] flex flex-col p-2 relative shadow-[0_0_40px_rgba(99,102,241,0.08)]"'
);

// Premium Inner Card
code = code.replace(
  'className="bg-[#0a0a0a] rounded-[28px] p-8 flex flex-col flex-1 border border-white/5 shadow-2xl"',
  'className="bg-[#0a0a0a] rounded-[48px] [corner-shape:squircle] p-8 flex flex-col flex-1 border border-white/5 shadow-2xl"'
);

// Enterprise Tier Card
code = code.replace(
  'className="bg-[#0a0a0a] rounded-[32px] p-10 flex flex-col border border-white/10 mt-0 md:mt-12"',
  'className="bg-[#0a0a0a] rounded-[55px] [corner-shape:squircle] p-10 flex flex-col border border-white/10 mt-0 md:mt-12"'
);

fs.writeFileSync('src/components/PricingPage.tsx', code);
console.log("Patched PricingPage");
