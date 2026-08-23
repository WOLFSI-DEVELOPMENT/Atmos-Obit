import re

with open("src/components/SettingsModal.tsx", "r") as f:
    content = f.read()

new_block = """
                  <div className="bg-[#2c2c2e] rounded-3xl [corner-shape:superellipse(1.82)] p-4 space-y-4 opacity-50 cursor-not-allowed">
                    <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-white font-medium">Context Caching & RAG</h3>
                        <span className="bg-[#0a84ff]/20 text-[#0a84ff] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Coming Soon</span>
                    </div>
                    <p className="text-[#8e8e93] text-xs">Right now, sending an entire codebase on every turn is slow and expensive. We can implement a vector database (like Chroma or Pinecone) to index the user's codebase. When the user asks for a change, VibeCoder would perform a semantic search to only pull the 2-3 relevant files into the LLM context, massively reducing token usage and latency. For Gemini specifically, we can integrate the new Context Caching API for instant recalls on large projects.</p>
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
"""

# Find the Swarm Architecture block and insert after its closing div
content = content.replace(
    'cutting complex task time in half.</p>\n                    <div className="flex items-start justify-between gap-4 pt-2">\n                      <span className="text-xs text-[#8e8e93]">Disabled</span>\n                      <button \n                        disabled\n                        className="w-11 h-6 rounded-full transition-colors relative shrink-0 bg-[#3a3a3c]"\n                      >\n                        <div className="absolute top-1 left-1 bg-white/50 w-4 h-4 rounded-full transition-transform translate-x-0" />\n                      </button>\n                    </div>\n                  </div>',
    'cutting complex task time in half.</p>\n                    <div className="flex items-start justify-between gap-4 pt-2">\n                      <span className="text-xs text-[#8e8e93]">Disabled</span>\n                      <button \n                        disabled\n                        className="w-11 h-6 rounded-full transition-colors relative shrink-0 bg-[#3a3a3c]"\n                      >\n                        <div className="absolute top-1 left-1 bg-white/50 w-4 h-4 rounded-full transition-transform translate-x-0" />\n                      </button>\n                    </div>\n                  </div>\n' + new_block
)

with open("src/components/SettingsModal.tsx", "w") as f:
    f.write(content)

print("Added RAG experiment")
