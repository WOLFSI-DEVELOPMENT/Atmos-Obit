const fs = require('fs');
let code = fs.readFileSync('src/components/ChatPanel.tsx', 'utf8');

// 1. Add MoreVertical to lucide imports
code = code.replace("CornerDownRight\n} from 'lucide-react';", "CornerDownRight,\n  MoreVertical\n} from 'lucide-react';");

// 2. Change pl-12 to pl-8, add MoreVertical next to app name
const oldHeader = `      {/* Top Workspace Header */}
      <div className="absolute top-0 left-0 right-0 py-2.5 pr-4 pl-12 flex items-center justify-between z-20 pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto">
          <h2 className="text-[17px] font-medium tracking-wide text-white">{project.name}</h2>
        </div>`;

const newHeader = `      {/* Top Workspace Header */}
      <div className="absolute top-0 left-0 right-0 py-2.5 pr-4 pl-8 flex items-center justify-between z-20 pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <h2 className="text-[17px] font-medium tracking-wide text-white">{project.name}</h2>
          <button className="p-1 text-neutral-500 hover:text-white transition-colors rounded-full hover:bg-white/5">
            <MoreVertical size={16} />
          </button>
        </div>`;

if(code.includes(oldHeader)) {
    code = code.replace(oldHeader, newHeader);
}

// 3. Replace the pin SVG with the new password-style SVG
const oldSvg = `              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
                <g clipPath="url(#clip0_4418_9526)">
                  <path d="M19.79 14.9303C17.73 16.9803 14.78 17.6103 12.19 16.8003L7.48002 21.5003C7.14002 21.8503 6.47002 22.0603 5.99002 21.9903L3.81002 21.6903C3.09002 21.5903 2.42002 20.9103 2.31002 20.1903L2.01002 18.0103C1.94002 17.5303 2.17002 16.8603 2.50002 16.5203L7.20002 11.8203C6.40002 9.22031 7.02002 6.27031 9.08002 4.22031C12.03 1.27031 16.82 1.27031 19.78 4.22031C22.74 7.17031 22.74 11.9803 19.79 14.9303Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M6.89001 17.4902L9.19001 19.7902" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M14.5 11C15.3284 11 16 10.3284 16 9.5C16 8.67157 15.3284 8 14.5 8C13.6716 8 13 8.67157 13 9.5C13 10.3284 13.6716 11 14.5 11Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </g>
                <defs>
                  <clipPath id="clip0_4418_9526">
                    <rect width="24" height="24" fill="white"/>
                  </clipPath>
                </defs>
              </svg>`;

const newSvg = `              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="12" viewBox="0 0 52 22" fill="none" className="text-current">
                <rect x="1.5" y="1.5" width="49" height="19" rx="4" stroke="currentColor" strokeWidth="2.5" />
                <path d="M12 7v8M8 11h8M9 8l6 6M9 14l6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M22 7v8M18 11h8M19 8l6 6M19 14l6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M32 7v8M28 11h8M29 8l6 6M29 14l6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M42 7v8M38 11h8M39 8l6 6M39 14l6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>`;

if(code.includes(oldSvg)) {
    code = code.replace(oldSvg, newSvg);
}

fs.writeFileSync('src/components/ChatPanel.tsx', code);
console.log("Patched correctly");
