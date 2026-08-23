const fs = require('fs');
let code = fs.readFileSync('src/components/ChatPanel.tsx', 'utf8');

const oldHeader = `      {/* Top Workspace Header */}
      <div className="py-1.5 pr-4 pl-12 border-b border-neutral-900 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Terminal className="w-5 h-5 text-neutral-400" />
          <div className="flex flex-col">
            <h2 className="text-sm font-semibold tracking-wide text-white">{project.name}</h2>
            <div className="flex items-center gap-1.5 text-[10px] text-neutral-500 font-mono">
              <span>PIN: {project.pin}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                {project.status === 'connected' ? (
                  <>
                    <Wifi size={10} className="text-neutral-300 animate-pulse" />
                    <span className="text-neutral-300 uppercase">Roblox Studio Synced</span>
                  </>
                ) : (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-600 animate-pulse" />
                    <span className="text-neutral-500 uppercase">Waiting for Studio...</span>
                  </>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Top Header Controls: Clear Chat, Sync Badge, Pin */}
        <div className="flex items-center gap-2 relative">`;

const newHeader = `      {/* Top Gradient Fade for Messages */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black via-black/90 to-transparent pointer-events-none z-10" />

      {/* Top Workspace Header */}
      <div className="absolute top-0 left-0 right-0 py-2.5 pr-4 pl-14 flex items-center justify-between z-20 pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto">
          <h2 className="text-[15px] font-semibold tracking-wide text-white">{project.name}</h2>
        </div>

        {/* Top Header Controls: Clear Chat, Sync Badge, Pin */}
        <div className="flex items-center gap-2 relative pointer-events-auto">`;

if (code.includes(oldHeader)) {
    code = code.replace(oldHeader, newHeader);
    
    // Also change padding of messages scroll area
    code = code.replace(
        `      {/* Messages Scroll Area */}\n      <div className="flex-1 overflow-y-auto p-6 pb-48 flex flex-col gap-6 scrollbar-thin">`,
        `      {/* Messages Scroll Area */}\n      <div className="flex-1 overflow-y-auto p-6 pt-16 pb-48 flex flex-col gap-6 scrollbar-thin">`
    );
    
    fs.writeFileSync('src/components/ChatPanel.tsx', code);
    console.log("Patched successfully");
} else {
    console.log("Could not find exact string. Showing file contents around line 320:");
    console.log(code.split('\n').slice(315, 350).join('\n'));
}
