import re

with open("src/components/SettingsModal.tsx", "r") as f:
    content = f.read()

# 1. Add FlaskConical to lucide-react imports
content = re.sub(
    r"import \{([^}]+)\} from 'lucide-react';",
    lambda m: f"import {{{m.group(1)}, FlaskConical}} from 'lucide-react';" if 'FlaskConical' not in m.group(1) else m.group(0),
    content
)

# 2. Update activeTab type
content = re.sub(
    r"useState\<'account' \| 'personalize' \| 'behavior' \| 'ai' \| 'permissions'\>\('account'\);",
    r"useState<'account' | 'personalize' | 'behavior' | 'ai' | 'permissions' | 'experiments'>('account');",
    content
)

# 3. Add useAstPatching state right after aiFontFamily
ast_state = """  const [useAstPatching, setUseAstPatching] = useState(false);"""
content = re.sub(
    r"(const \[aiFontFamily, setAiFontFamily\] = useState\('default'\);)",
    r"\1\n" + ast_state,
    content
)

# 4. Add load effect for useAstPatching
load_ast = """    setUseAstPatching(localStorage.getItem('vibecoder_use_ast_patching') === 'true');"""
content = re.sub(
    r"(setAiFontFamily\(localStorage.getItem\('vibecoder_ai_font_family'\) \|\| 'default'\);)",
    r"\1\n" + load_ast,
    content
)

# 5. Add handler for AST Patching right before handleSetAiFontFamily
handle_ast = """
  const handleToggleAstPatching = () => {
    const newVal = !useAstPatching;
    setUseAstPatching(newVal);
    localStorage.setItem('vibecoder_use_ast_patching', newVal.toString());
  };
"""
content = re.sub(
    r"(const handleSetAiFontFamily = \(val: string\) => \{)",
    handle_ast + r"\n  \1",
    content
)

# 6. Add Experiments button to Sidebar
sidebar_btn = """
              <button 
                onClick={() => { setActiveTab('experiments'); setActiveSubView('main'); }}
                className={`w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-sm transition-colors ${
                  activeTab === 'experiments' 
                    ? 'bg-[#2c2c2e] text-white' 
                    : 'text-white hover:bg-[#2c2c2e]'
                }`}
              >
                <div className={`w-6 h-6 rounded-md flex items-center justify-center ${activeTab === 'experiments' ? 'bg-white/20' : 'bg-[#3a3a3c]'}`}>
                  <FlaskConical size={14} className="text-white" />
                </div>
                Experiments
              </button>
"""
content = re.sub(
    r"(<button \s*onClick=\{\(\) => \{ setActiveTab\('permissions'\); [^>]+>\s*<div[^>]+>\s*<Shield[^>]+/>\s*</div>\s*Permissions\s*</button>)",
    r"\1" + sidebar_btn,
    content
)

# 7. Add header title for experiments
title_str = """              {activeTab === 'experiments' && 'Experiments'}"""
content = re.sub(
    r"(\{activeTab === 'permissions' && 'Permissions'\})",
    r"\1\n" + title_str,
    content
)

# 8. Add Experiments content block at the very end of the AnimatePresence block
exp_block = """
              {activeTab === 'experiments' && (
                <motion.div 
                  key="experiments"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.15 }}
                  className="p-8 max-w-xl mx-auto space-y-6"
                >
                  
                  <div className="bg-[#2c2c2e] rounded-3xl [corner-shape:superellipse(1.82)] p-4 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-white font-medium mb-1">AST Patching (Fast Diffs)</h3>
                        <p className="text-[#8e8e93] text-xs">Instead of rewriting an entire file to change one variable, instruct the LLM to output small diffs or Abstract Syntax Tree mutations. Reduces generation time from 15 seconds to 2 seconds.</p>
                      </div>
                      <button 
                        onClick={handleToggleAstPatching}
                        className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${useAstPatching ? 'bg-[#0a84ff]' : 'bg-[#3a3a3c]'}`}
                      >
                        <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${useAstPatching ? 'translate-x-5' : 'translate-x-0'}`} />
                      </button>
                    </div>
                  </div>

                  <div className="bg-[#2c2c2e] rounded-3xl [corner-shape:superellipse(1.82)] p-4 space-y-4 opacity-50 cursor-not-allowed">
                    <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-white font-medium">Multi-Agent Parallelism (Swarm Architecture)</h3>
                        <span className="bg-[#0a84ff]/20 text-[#0a84ff] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Coming Soon</span>
                    </div>
                    <p className="text-[#8e8e93] text-xs">Manager Agent spawns parallel Worker Agents to execute tasks (e.g., frontend and backend) simultaneously, cutting complex task time in half.</p>
                    <div className="flex items-start justify-between gap-4 pt-2">
                      <span className="text-xs text-[#8e8e93]">Disabled</span>
                      <button 
                        disabled
                        className="w-11 h-6 rounded-full transition-colors relative shrink-0 bg-[#3a3a3c]"
                      >
                        <div className="absolute top-1 left-1 bg-white/50 w-4 h-4 rounded-full transition-transform translate-x-0" />
                      </button>
                    </div>
                  </div>

                </motion.div>
              )}
"""

# Insert before closing AnimatePresence
content = content.replace("            </AnimatePresence>", exp_block + "            </AnimatePresence>")

with open("src/components/SettingsModal.tsx", "w") as f:
    f.write(content)

print("Patched SettingsModal")
