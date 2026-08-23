import re

with open("src/components/SettingsModal.tsx", "r") as f:
    content = f.read()

new_content = """                  <div className="space-y-4 mt-6">
                    <div className="flex items-center gap-3 ml-2">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/ChatGPT-Logo.svg/1280px-ChatGPT-Logo.svg.png" className="w-5 h-5 object-contain invert opacity-80" alt="ChatGPT" />
                      <h3 className="text-[13px] text-[#8e8e93] uppercase font-medium">OpenAI</h3>
                    </div>
                    <div className="bg-[#2c2c2e] rounded-3xl [corner-shape:superellipse(1.82)] overflow-hidden">
                      {OPENAI_MODELS.map((model, idx) => {
                        const isSelected = model.id === selectedModel;
                        const currentLevel = thinkingLevels[model.id] || model.defaultLevel;

                        return (
                          <div key={model.id} className={`p-4 ${idx !== OPENAI_MODELS.length - 1 ? 'border-b border-white/5' : ''} ${isSelected ? 'bg-white/5' : ''}`}>
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 cursor-pointer" onClick={() => handleSelectModel(model.id)}>
                                <div className="flex items-center gap-3">
                                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${isSelected ? 'border-[#0a84ff]' : 'border-[#8e8e93]'}`}>
                                    {isSelected && <div className="w-2 h-2 rounded-full bg-[#0a84ff]" />}
                                  </div>
                                  <span className="text-white text-sm font-medium">{model.label}</span>
                                </div>
                                <p className="text-[#8e8e93] text-xs mt-1 ml-7">{model.desc}</p>
                              </div>
                              
                              <div className="shrink-0 pt-1">
                                <select 
                                  value={currentLevel}
                                  onChange={(e) => handleSetThinkingLevel(model.id, e.target.value as ThinkingLevel)}
                                  className="bg-[#1c1c1e] text-white text-xs rounded-full px-3 py-2 focus:outline-none"
                                >
                                  {model.supportedLevels.map(level => (
                                    <option key={level} value={level}>{level}</option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-4 mt-6">
                    <div className="flex items-center gap-3 ml-2">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Claude_AI_symbol.svg/960px-Claude_AI_symbol.svg.png" className="w-5 h-5 object-contain" alt="Claude" />
                      <h3 className="text-[13px] text-[#8e8e93] uppercase font-medium">Anthropic</h3>
                    </div>
                    <div className="bg-[#2c2c2e] rounded-3xl [corner-shape:superellipse(1.82)] overflow-hidden">
                      {ANTHROPIC_MODELS.map((model, idx) => {
                        const isSelected = model.id === selectedModel;
                        const currentLevel = thinkingLevels[model.id] || model.defaultLevel;

                        return (
                          <div key={model.id} className={`p-4 ${idx !== ANTHROPIC_MODELS.length - 1 ? 'border-b border-white/5' : ''} ${isSelected ? 'bg-white/5' : ''}`}>
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 cursor-pointer" onClick={() => handleSelectModel(model.id)}>
                                <div className="flex items-center gap-3">
                                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${isSelected ? 'border-[#0a84ff]' : 'border-[#8e8e93]'}`}>
                                    {isSelected && <div className="w-2 h-2 rounded-full bg-[#0a84ff]" />}
                                  </div>
                                  <span className="text-white text-sm font-medium">{model.label}</span>
                                </div>
                                <p className="text-[#8e8e93] text-xs mt-1 ml-7">{model.desc}</p>
                              </div>
                              
                              <div className="shrink-0 pt-1">
                                <select 
                                  value={currentLevel}
                                  onChange={(e) => handleSetThinkingLevel(model.id, e.target.value as ThinkingLevel)}
                                  className="bg-[#1c1c1e] text-white text-xs rounded-full px-3 py-2 focus:outline-none"
                                >
                                  {model.supportedLevels.map(level => (
                                    <option key={level} value={level}>{level}</option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>"""

old_pattern = r'''<div className="space-y-4 opacity-50 cursor-not-allowed mt-6">
                    <div className="flex items-center gap-3 ml-2">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/ChatGPT-Logo.svg/1280px-ChatGPT-Logo.svg.png" className="w-5 h-5 object-contain invert opacity-80" alt="ChatGPT" />.*?</div>
                  </div>'''

content_new = re.sub(old_pattern, new_content, content, flags=re.DOTALL)

with open("src/components/SettingsModal.tsx", "w") as f:
    f.write(content_new)

print("Updated SettingsModal models")
