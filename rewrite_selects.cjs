const fs = require('fs');

let content = fs.readFileSync('src/components/SettingsModal.tsx', 'utf8');

// Inject CustomSelect right after imports
const customSelectCode = `
const CustomSelect = ({ 
  value, 
  onChange, 
  options, 
  className = ""
}: { 
  value: string, 
  onChange: (v: string) => void, 
  options: { label: string, value: string }[], 
  className?: string
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const selectedOption = options.find(o => o.value === value) || options[0];
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [ref]);

  return (
    <div className={\`relative \${className}\`} ref={ref}>
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full bg-[#1c1c1e]/60 backdrop-blur-xl border border-[#2a2a2a] text-white text-xs rounded-full px-3 py-1.5 focus:outline-none transition-colors hover:bg-[#2c2c2e]/80"
      >
        <span className="truncate mr-3">{selectedOption?.label}</span>
        <ChevronDown size={14} className={\`text-[#8e8e93] transition-transform \${isOpen ? 'rotate-180' : ''}\`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 z-50 min-w-full sm:min-w-[160px] bg-[#1a1a1c]/80 backdrop-blur-xl border border-[#2a2a2a] p-1.5 rounded-2xl shadow-2xl flex flex-col gap-1"
          >
            {options.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={\`text-left px-3 py-2 text-xs rounded-xl transition-all \${value === opt.value ? 'bg-[#3a3a3c] text-white font-medium shadow-sm' : 'text-[#8e8e93] hover:bg-[#2c2c2e] hover:text-white'}\`}
              >
                {opt.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
`;

const interfaceMatch = 'interface SettingsModalProps {';
if (!content.includes('const CustomSelect')) {
  content = content.replace(interfaceMatch, customSelectCode + '\n' + interfaceMatch);
}

// 1. AI Response Font
const fontSelect = `<select 
                          value={aiFontFamily}
                          onChange={(e) => handleSetAiFontFamily(e.target.value)}
                          className="w-full bg-[#1c1c1e] text-white text-sm rounded-full px-4 py-2.5 focus:outline-none"
                        >
                          <option value="default">System Default</option>
                          <option value="mono">Monospace (Code)</option>
                          <option value="serif">Serif (Elegant)</option>
                        </select>`;
const newFontSelect = `<CustomSelect 
                          value={aiFontFamily}
                          onChange={handleSetAiFontFamily}
                          className="w-full mt-2"
                          options={[
                            { value: 'default', label: 'System Default' },
                            { value: 'mono', label: 'Monospace (Code)' },
                            { value: 'serif', label: 'Serif (Elegant)' }
                          ]}
                        />`;
content = content.replace(fontSelect, newFontSelect);

// 2. Response Tone
const toneSelect = `<select 
                      value={responseTone}
                      onChange={(e) => handleSetTone(e.target.value)}
                      className="w-full bg-[#1c1c1e] text-white text-sm rounded-full px-4 py-2.5 focus:outline-none"
                    >
                      <option value="default">Default & Direct</option>
                      <option value="concise">Ultra Concise</option>
                      <option value="friendly">Friendly & Explanatory</option>
                      <option value="professional">Strictly Professional</option>
                      <option value="pirate">Pirate (Yarrr)</option>
                    </select>`;
const newToneSelect = `<CustomSelect 
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
                    />`;
content = content.replace(toneSelect, newToneSelect);

// 3. GUI Style
const styleSelect = `<select 
                      value={guiStyle}
                      onChange={(e) => handleSetGuiStyle(e.target.value)}
                      className="w-full bg-[#1c1c1e] text-white text-sm rounded-full px-4 py-2.5 focus:outline-none"
                    >
                      <option value="default">System Default (Modern)</option>
                      <option value="flat">Flat / Minimalist</option>
                      <option value="cartoon">Cartoon / Simulator</option>
                      <option value="scifi">Sci-Fi / Futuristic</option>
                      <option value="retro">Retro / Pixel Art</option>
                    </select>`;
const newStyleSelect = `<CustomSelect 
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
                    />`;
content = content.replace(styleSelect, newStyleSelect);

// 4. Model Thinking Levels (Gemini, OpenAI, Anthropic)
const thinkingSelectPattern = /<select \s*value=\{currentLevel\}\s*onChange=\{\(e\) => handleSetThinkingLevel\(model\.id, e\.target\.value as ThinkingLevel\)\}\s*className="bg-\[#1c1c1e\] text-white text-xs rounded-full px-3 py-2 focus:outline-none"\s*>\s*\{model\.supportedLevels\.map\(level => \(\s*<option key=\{level\} value=\{level\}>\{level\}<\/option>\s*\)\)\}\s*<\/select>/g;
const newThinkingSelect = `<CustomSelect 
                                  value={currentLevel}
                                  onChange={(val) => handleSetThinkingLevel(model.id, val as ThinkingLevel)}
                                  options={model.supportedLevels.map(level => ({ value: level, label: level }))}
                                />`;
content = content.replace(thinkingSelectPattern, newThinkingSelect);

// 5. Custom Models Thinking Levels
const customModelThinkingSelect = `<select 
                                value={currentLevel}
                                onChange={(e) => handleSetThinkingLevel(id, e.target.value as ThinkingLevel)}
                                className="bg-[#1c1c1e] text-white text-xs rounded-full px-3 py-2 focus:outline-none"
                              >
                                {['MINIMAL', 'LOW', 'MEDIUM', 'HIGH', 'XHIGH', 'MAX'].map(level => (
                                  <option key={level} value={level}>{level}</option>
                                ))}
                              </select>`;
const newCustomModelThinkingSelect = `<CustomSelect 
                                value={currentLevel}
                                onChange={(val) => handleSetThinkingLevel(id, val as ThinkingLevel)}
                                options={['NONE', 'MINIMAL', 'LOW', 'MEDIUM', 'HIGH', 'XHIGH', 'MAX'].map(level => ({ value: level, label: level }))}
                              />`;
if(content.includes(customModelThinkingSelect)) {
    content = content.replace(customModelThinkingSelect, newCustomModelThinkingSelect);
}

fs.writeFileSync('src/components/SettingsModal.tsx', content);
console.log("Rewrote selects to CustomSelect");
