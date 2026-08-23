const fs = require('fs');
let content = fs.readFileSync('src/components/SettingsModal.tsx', 'utf8');

const newOpenAI = `
                  <div className="space-y-4 opacity-50 cursor-not-allowed mt-6">
                    <div className="flex items-center gap-3 ml-2">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/ChatGPT-Logo.svg/1280px-ChatGPT-Logo.svg.png" className="w-5 h-5 object-contain invert opacity-80" alt="ChatGPT" />
                      <h3 className="text-[13px] text-[#8e8e93] uppercase font-medium">OpenAI (Coming Soon)</h3>
                    </div>
                    <div className="bg-[#2c2c2e] rounded-3xl [corner-shape:superellipse(1.82)] overflow-hidden">
                      <div className="p-4 border-b border-white/5 pointer-events-none">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <div className="w-4 h-4 rounded-full border border-[#8e8e93] flex items-center justify-center shrink-0"></div>
                              <span className="text-white text-sm font-medium">GPT-5.6 Sol (Flagship)</span>
                            </div>
                            <p className="text-[#8e8e93] text-xs mt-1 ml-7">Maximum reasoning depth for complex professional or coding work.</p>
                          </div>
                          <div className="shrink-0 pt-1">
                            <select disabled className="bg-[#1c1c1e] text-[#8e8e93] text-xs rounded-full px-3 py-2 focus:outline-none opacity-80">
                              <option>Medium (Default)</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 border-b border-white/5 pointer-events-none">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <div className="w-4 h-4 rounded-full border border-[#8e8e93] flex items-center justify-center shrink-0"></div>
                              <span className="text-white text-sm font-medium">GPT-5.6 Terra (Balanced)</span>
                            </div>
                            <p className="text-[#8e8e93] text-xs mt-1 ml-7">Balanced execution and intelligence.</p>
                          </div>
                          <div className="shrink-0 pt-1">
                            <select disabled className="bg-[#1c1c1e] text-[#8e8e93] text-xs rounded-full px-3 py-2 focus:outline-none opacity-80">
                              <option>Medium (Default)</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 pointer-events-none">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <div className="w-4 h-4 rounded-full border border-[#8e8e93] flex items-center justify-center shrink-0"></div>
                              <span className="text-white text-sm font-medium">GPT-5.6 Luna (Cost-Efficient)</span>
                            </div>
                            <p className="text-[#8e8e93] text-xs mt-1 ml-7">Cost-efficient model for everyday tasks.</p>
                          </div>
                          <div className="shrink-0 pt-1">
                            <select disabled className="bg-[#1c1c1e] text-[#8e8e93] text-xs rounded-full px-3 py-2 focus:outline-none opacity-80">
                              <option>Medium (Default)</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 opacity-50 cursor-not-allowed mt-6">
                    <div className="flex items-center gap-3 ml-2">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Claude_AI_symbol.svg/960px-Claude_AI_symbol.svg.png" className="w-5 h-5 object-contain" alt="Claude" />
                      <h3 className="text-[13px] text-[#8e8e93] uppercase font-medium">Anthropic (Coming Soon)</h3>
                    </div>
                    <div className="bg-[#2c2c2e] rounded-3xl [corner-shape:superellipse(1.82)] overflow-hidden">
                      <div className="p-4 border-b border-white/5 pointer-events-none">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <div className="w-4 h-4 rounded-full border border-[#8e8e93] flex items-center justify-center shrink-0"></div>
                              <span className="text-white text-sm font-medium">Claude Fable 5</span>
                            </div>
                            <p className="text-[#8e8e93] text-xs mt-1 ml-7">Frontier capability for massive enterprise reasoning and multi-day workflows.</p>
                          </div>
                          <div className="shrink-0 pt-1">
                            <select disabled className="bg-[#1c1c1e] text-[#8e8e93] text-xs rounded-full px-3 py-2 focus:outline-none opacity-80">
                              <option>Medium (Default)</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 border-b border-white/5 pointer-events-none">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <div className="w-4 h-4 rounded-full border border-[#8e8e93] flex items-center justify-center shrink-0"></div>
                              <span className="text-white text-sm font-medium">Claude Opus 5</span>
                            </div>
                            <p className="text-[#8e8e93] text-xs mt-1 ml-7">Balanced and proactive daily-use model.</p>
                          </div>
                          <div className="shrink-0 pt-1">
                            <select disabled className="bg-[#1c1c1e] text-[#8e8e93] text-xs rounded-full px-3 py-2 focus:outline-none opacity-80">
                              <option>Medium (Default)</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 pointer-events-none">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <div className="w-4 h-4 rounded-full border border-[#8e8e93] flex items-center justify-center shrink-0"></div>
                              <span className="text-white text-sm font-medium">Claude Sonnet 5</span>
                            </div>
                            <p className="text-[#8e8e93] text-xs mt-1 ml-7">Fast, agentic execution and scaled autonomous tool utilization.</p>
                          </div>
                          <div className="shrink-0 pt-1">
                            <select disabled className="bg-[#1c1c1e] text-[#8e8e93] text-xs rounded-full px-3 py-2 focus:outline-none opacity-80">
                              <option>Medium (Default)</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
`;

// Extract before OpenAI and after Anthropic
const startIdx = content.indexOf('<div className="space-y-4 opacity-50 cursor-not-allowed mt-6">');
const endString = '                  <div className="bg-[#2c2c2e] rounded-3xl [corner-shape:superellipse(1.82)] overflow-hidden mt-6">';
const endIdx = content.indexOf(endString, startIdx);

if (startIdx !== -1 && endIdx !== -1) {
  content = content.substring(0, startIdx) + newOpenAI.trim() + '\n\n' + content.substring(endIdx);
  fs.writeFileSync('src/components/SettingsModal.tsx', content);
  console.log('updated content');
} else {
  console.log('pattern not found');
}
