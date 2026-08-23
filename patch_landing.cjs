const fs = require('fs');
let code = fs.readFileSync('src/components/LandingPage.tsx', 'utf8');

// App icon wrappers
code = code.replace(/rounded-xl flex items-center/g, 'rounded-[55px] [corner-shape:squircle] flex items-center');

// Main CTA buttons
code = code.replace(/rounded-full font-bold/g, 'rounded-[55px] [corner-shape:squircle] font-bold');
code = code.replace(/rounded-full font-semibold/g, 'rounded-[55px] [corner-shape:squircle] font-semibold');

// Quick select buttons ("FPS", "Tycoon")
code = code.replace(/rounded-xl whitespace-nowrap/g, 'rounded-[55px] [corner-shape:squircle] whitespace-nowrap');

// Input wrapper
code = code.replace(/rounded-2xl relative p-4 flex flex-col/g, 'rounded-[55px] [corner-shape:squircle] relative p-4 flex flex-col');

// Feature cards
code = code.replace(/rounded-\[24px\] p-4 flex flex-col group/g, 'rounded-[55px] [corner-shape:squircle] p-4 flex flex-col group');

// Feature card inner image wrapper
code = code.replace(/bg-\[#111\] rounded-xl mb-6/g, 'bg-[#111] rounded-[40px] [corner-shape:squircle] mb-6');

// Testimonial cards
code = code.replace(/rounded-\[24px\] p-8 flex flex-col justify-between/g, 'rounded-[55px] [corner-shape:squircle] p-8 flex flex-col justify-between');

// FAQ cards
code = code.replace(/rounded-\[20px\] overflow-hidden/g, 'rounded-[55px] [corner-shape:squircle] overflow-hidden');

// Submit button inside input
code = code.replace(/rounded-full flex items-center justify-center transition-all duration-200/g, 'rounded-[55px] [corner-shape:squircle] flex items-center justify-center transition-all duration-200');

fs.writeFileSync('src/components/LandingPage.tsx', code);
console.log("Patched LandingPage");
