import re

with open("src/components/SettingsModal.tsx", "r") as f:
    content = f.read()

# Add state
states = """  const [useAstPatching, setUseAstPatching] = useState(false);
  const [enableWikimediaExperiment, setEnableWikimediaExperiment] = useState(false);
  const [allowWikimedia, setAllowWikimedia] = useState(false);"""
content = re.sub(r"  const \[useAstPatching, setUseAstPatching\] = useState\(false\);", states, content)

# Add load effect
loads = """    setUseAstPatching(localStorage.getItem('vibecoder_use_ast_patching') === 'true');
    setEnableWikimediaExperiment(localStorage.getItem('vibecoder_exp_wikimedia') === 'true');
    setAllowWikimedia(localStorage.getItem('vibecoder_allow_wikimedia') === 'true');"""
content = re.sub(r"    setUseAstPatching\(localStorage\.getItem\('vibecoder_use_ast_patching'\) === 'true'\);", loads, content)

# Add handlers
handlers = """  const handleToggleAstPatching = () => {
    const newVal = !useAstPatching;
    setUseAstPatching(newVal);
    localStorage.setItem('vibecoder_use_ast_patching', newVal.toString());
  };

  const handleToggleWikimediaExperiment = () => {
    const newVal = !enableWikimediaExperiment;
    setEnableWikimediaExperiment(newVal);
    localStorage.setItem('vibecoder_exp_wikimedia', newVal.toString());
  };

  const handleToggleWikimedia = () => {
    const newVal = !allowWikimedia;
    setAllowWikimedia(newVal);
    localStorage.setItem('vibecoder_allow_wikimedia', newVal.toString());
  };"""
content = re.sub(r"  const handleToggleAstPatching = \(\) => \{\n    const newVal = !useAstPatching;\n    setUseAstPatching\(newVal\);\n    localStorage\.setItem\('vibecoder_use_ast_patching', newVal\.toString\(\)\);\n  \};", handlers, content)

# Add to permissions tab
perm_block = """                  {enableWikimediaExperiment && (
                    <div className="bg-[#2c2c2e] rounded-3xl [corner-shape:superellipse(1.82)] p-4 flex items-center justify-between">
                      <div>
                        <h3 className="text-white font-medium mb-1">Wikimedia API Access</h3>
                        <p className="text-[#8e8e93] text-xs">Allow VibeCoder to query and download public domain assets from Wikimedia.</p>
                      </div>
                      <button 
                        onClick={handleToggleWikimedia}
                        className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${allowWikimedia ? 'bg-[#34c759]' : 'bg-[#3a3a3c]'}`}
                      >
                        <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${allowWikimedia ? 'translate-x-5' : 'translate-x-0'}`} />
                      </button>
                    </div>
                  )}
                </motion.div>"""
content = re.sub(r"                </motion\.div>\s*\}\)", perm_block + "\n              )}", content)


# Add to experiments tab
exp_block = """                  <div className="bg-[#2c2c2e] rounded-3xl [corner-shape:superellipse(1.82)] p-4 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-white font-medium mb-1">AST Patching (Fast Diffs)</h3>"""

new_exp_block = """                  <div className="bg-[#2c2c2e] rounded-3xl [corner-shape:superellipse(1.82)] p-4 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-white font-medium mb-1">Wikimedia Asset Fetching</h3>
                        <p className="text-[#8e8e93] text-xs">Allow VibeCoder to fetch creative commons images, icons, and audio from Wikimedia.</p>
                      </div>
                      <button 
                        onClick={handleToggleWikimediaExperiment}
                        className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${enableWikimediaExperiment ? 'bg-[#0a84ff]' : 'bg-[#3a3a3c]'}`}
                      >
                        <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${enableWikimediaExperiment ? 'translate-x-5' : 'translate-x-0'}`} />
                      </button>
                    </div>
                  </div>

                  <div className="bg-[#2c2c2e] rounded-3xl [corner-shape:superellipse(1.82)] p-4 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-white font-medium mb-1">AST Patching (Fast Diffs)</h3>"""
content = content.replace(exp_block, new_exp_block)

with open("src/components/SettingsModal.tsx", "w") as f:
    f.write(content)

print("Patched Wikimedia")
