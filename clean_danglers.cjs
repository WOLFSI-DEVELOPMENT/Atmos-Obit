const fs = require('fs');

const lines = fs.readFileSync('src/components/SettingsModal.tsx', 'utf8').split('\n');

// 827 to 864 are the dangling ones. Remember lines are 1-indexed in sed, 0-indexed in JS.
// So lines[826] to lines[863] need to be deleted.
// Wait, let's look for the exact string to be safe.
const danglingString = `                     
                      </div>
                      <div className="p-4 border-b border-white/5 pointer-events-none">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <div className="w-4 h-4 rounded-full border border-[#8e8e93] flex items-center justify-center shrink-0"></div>
                              <span className="text-white text-sm font-medium">Claude Opus 5</span>`;

let content = fs.readFileSync('src/components/SettingsModal.tsx', 'utf8');
if (content.includes('Claude Opus 5')) {
    console.log("Found dangling Opus 5");
}

