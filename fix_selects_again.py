import re

with open("src/components/SettingsModal.tsx", "r") as f:
    content = f.read()

# Font Select
content = re.sub(
    r'<select\s+value=\{aiFontFamily\}\s+onChange=\{\(e\) => handleSetAiFontFamily\(e\.target\.value\)\}\s+className="[^"]+"\s*>\s*<option value="default">System Default</option>\s*<option value="mono">Monospace \(Code\)</option>\s*<option value="serif">Serif \(Elegant\)</option>\s*</select>',
    r'''<CustomSelect 
                          value={aiFontFamily}
                          onChange={handleSetAiFontFamily}
                          className="w-full mt-2"
                          options={[
                            { value: 'default', label: 'System Default' },
                            { value: 'mono', label: 'Monospace (Code)' },
                            { value: 'serif', label: 'Serif (Elegant)' }
                          ]}
                        />''',
    content, flags=re.DOTALL
)

# Tone Select
content = re.sub(
    r'<select\s+value=\{responseTone\}\s+onChange=\{\(e\) => handleSetTone\(e\.target\.value\)\}\s+className="[^"]+"\s*>\s*<option value="default">Default & Direct</option>\s*<option value="concise">Ultra Concise</option>\s*<option value="friendly">Friendly & Explanatory</option>\s*<option value="professional">Strictly Professional</option>\s*<option value="pirate">Pirate \(Yarrr\)</option>\s*</select>',
    r'''<CustomSelect 
                      value={responseTone}
                      onChange={handleSetTone}
                      className="w-full"
                      options={[
                        { value: 'default', label: 'Default & Direct' },
                        { value: 'concise', label: 'Ultra Concise' },
                        { value: 'friendly', label: 'Friendly & Explanatory' },
                        { value: 'professional', label: 'Strictly Professional' },
                        { value: 'pirate', label: 'Pirate (Yarrr)' }
                      ]}
                    />''',
    content, flags=re.DOTALL
)

# Style Select
content = re.sub(
    r'<select\s+value=\{guiStyle\}\s+onChange=\{\(e\) => handleSetGuiStyle\(e\.target\.value\)\}\s+className="[^"]+"\s*>\s*<option value="default">System Default \(Modern\)</option>\s*<option value="flat">Flat / Minimalist</option>\s*<option value="cartoon">Cartoon / Simulator</option>\s*<option value="scifi">Sci-Fi / Futuristic</option>\s*<option value="retro">Retro / Pixel Art</option>\s*</select>',
    r'''<CustomSelect 
                      value={guiStyle}
                      onChange={handleSetGuiStyle}
                      className="w-full"
                      options={[
                        { value: 'default', label: 'System Default (Modern)' },
                        { value: 'flat', label: 'Flat / Minimalist' },
                        { value: 'cartoon', label: 'Cartoon / Simulator' },
                        { value: 'scifi', label: 'Sci-Fi / Futuristic' },
                        { value: 'retro', label: 'Retro / Pixel Art' }
                      ]}
                    />''',
    content, flags=re.DOTALL
)

# Custom Models Thinking Select
content = re.sub(
    r'<select\s+value=\{currentLevel\}\s+onChange=\{\(e\) => handleSetThinkingLevel\(id, e\.target\.value as ThinkingLevel\)\}\s+className="[^"]+"\s*>\s*\{\[\'MINIMAL\', \'LOW\', \'MEDIUM\', \'HIGH\', \'XHIGH\', \'MAX\'\]\.map\(level => \(\s*<option key=\{level\} value=\{level\}>\{level\}</option>\s*\)\)\}\s*</select>',
    r'''<CustomSelect 
                                value={currentLevel}
                                onChange={(val) => handleSetThinkingLevel(id, val as ThinkingLevel)}
                                options={['NONE', 'MINIMAL', 'LOW', 'MEDIUM', 'HIGH', 'XHIGH', 'MAX'].map(level => ({ value: level, label: level }))}
                              />''',
    content, flags=re.DOTALL
)

# Change disabled select options to match CustomSelect look statically since they are disabled
content = re.sub(
    r'<select disabled className="bg-\[#1c1c1e\] text-\[#8e8e93\] text-xs rounded-full px-3 py-2 focus:outline-none opacity-80">\s*<option>Medium \(Default\)</option>\s*</select>',
    r'''<div className="flex items-center justify-between bg-[#1c1c1e]/60 backdrop-blur-xl border border-[#2a2a2a] text-[#8e8e93] text-xs rounded-full px-3 py-1.5 focus:outline-none opacity-50 cursor-not-allowed">
                                <span className="truncate mr-3">Medium (Default)</span>
                                <ChevronDown size={14} className="text-[#8e8e93]" />
                              </div>''',
    content, flags=re.DOTALL
)

with open("src/components/SettingsModal.tsx", "w") as f:
    f.write(content)

print("Fixed remaining selects")
