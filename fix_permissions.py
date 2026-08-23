import re

with open("src/components/SettingsModal.tsx", "r") as f:
    content = f.read()

perm_block = """
                  {enableWikimediaExperiment && (
                    <div className="bg-[#2c2c2e] rounded-3xl [corner-shape:superellipse(1.82)] p-4 flex items-center justify-between mt-6">
                      <div>
                        <h3 className="text-white font-medium mb-1">Wikimedia API Access</h3>
                        <p className="text-[#8e8e93] text-xs">Allow VibeCoder to query and download public domain assets from Wikimedia.</p>
                      </div>
                      <button 
                        onClick={handleToggleWikimedia}
                        className={`w-12 h-6 rounded-full p-1 transition-colors ${allowWikimedia ? 'bg-[#32d74b]' : 'bg-[#3a3a3c]'}`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${allowWikimedia ? 'translate-x-6' : 'translate-x-0'}`} />
                      </button>
                    </div>
                  )}
"""

content = content.replace(
    '</button>\n                    </div>\n                  </div>\n                </motion.div>\n              )}',
    '</button>\n                    </div>\n                  </div>\n' + perm_block + '\n                </motion.div>\n              )}'
)

with open("src/components/SettingsModal.tsx", "w") as f:
    f.write(content)

print("Fixed")
