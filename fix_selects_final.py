import re

with open("src/components/SettingsModal.tsx", "r") as f:
    content = f.read()

# Font Select
content = re.sub(
    r'<select\s+value=\{aiFontFamily\}(.*?)</select>',
    r'''<CustomSelect 
                          value={aiFontFamily}
                          onChange={handleSetAiFontFamily}
                          className="w-full mt-2"
                          options={[
                            { value: 'default', label: 'Default (System Sans)' },
                            { value: 'mono', label: 'Monospace (Code)' },
                            { value: 'serif', label: 'Serif (Elegant)' }
                          ]}
                        />''',
    content, flags=re.DOTALL
)

# Tone Select
content = re.sub(
    r'<select\s+value=\{responseTone\}(.*?)</select>',
    r'''<CustomSelect 
                      value={responseTone}
                      onChange={handleSetTone}
                      className="w-full"
                      options={[
                        { value: 'default', label: 'Let AI Decide (Default)' },
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
    r'<select\s+value=\{guiStyle\}(.*?)</select>',
    r'''<CustomSelect 
                      value={guiStyle}
                      onChange={handleSetGuiStyle}
                      className="w-full"
                      options={[
                        { value: 'default', label: 'Let AI Decide (Based on prompt)' },
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
    r'<select\s+value=\{currentLevel\}\s+onChange=\{\(e\) => handleSetThinkingLevel\(id, e\.target\.value as ThinkingLevel\)\}(.*?)</select>',
    r'''<CustomSelect 
                                value={currentLevel}
                                onChange={(val) => handleSetThinkingLevel(id, val as ThinkingLevel)}
                                options={['NONE', 'MINIMAL', 'LOW', 'MEDIUM', 'HIGH', 'XHIGH', 'MAX'].map(level => ({ value: level, label: level }))}
                              />''',
    content, flags=re.DOTALL
)

with open("src/components/SettingsModal.tsx", "w") as f:
    f.write(content)

print("Fixed remaining selects")
