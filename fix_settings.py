import re

with open('src/components/SettingsModal.tsx', 'r') as f:
    content = f.read()

# 1. Add state
content = re.sub(
    r"const \[artifactsEnabled, setArtifactsEnabled\] = useState\(false\);",
    "const [artifactsEnabled, setArtifactsEnabled] = useState(false);\n  const [guiCreationEnabled, setGuiCreationEnabled] = useState(false);",
    content
)

# 2. Init in useEffect
content = re.sub(
    r"setArtifactsEnabled\(localStorage.getItem\('vibecoder_exp_artifacts'\) === 'true'\);",
    "setArtifactsEnabled(localStorage.getItem('vibecoder_exp_artifacts') === 'true');\n      setGuiCreationEnabled(localStorage.getItem('vibecoder_exp_gui_creation') === 'true');",
    content
)

# 3. Toggle handler
content = re.sub(
    r"const handleToggleArtifacts = \(\) => \{\n    const newVal = !artifactsEnabled;\n    setArtifactsEnabled\(newVal\);\n    localStorage.setItem\('vibecoder_exp_artifacts', newVal.toString\(\)\);\n  \};",
    """const handleToggleArtifacts = () => {
    const newVal = !artifactsEnabled;
    setArtifactsEnabled(newVal);
    localStorage.setItem('vibecoder_exp_artifacts', newVal.toString());
  };
  const handleToggleGuiCreation = () => {
    const newVal = !guiCreationEnabled;
    setGuiCreationEnabled(newVal);
    localStorage.setItem('vibecoder_exp_gui_creation', newVal.toString());
  };""",
    content
)

# 4. Add UI in Experiments tab
ui_code = """                  <div className="bg-[#2c2c2e] rounded-3xl [corner-shape:superellipse(1.82)] p-4 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-white font-medium mb-1">GUI Creation v1</h3>
                        <p className="text-[#8e8e93] text-xs">Allow VibeCoder to create fully functional, best-in-class GUI-based games directly.</p>
                      </div>
                      <button 
                        onClick={handleToggleGuiCreation}
                        className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${guiCreationEnabled ? 'bg-[#0a84ff]' : 'bg-[#3a3a3c]'}`}
                      >
                        <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${guiCreationEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                      </button>
                    </div>
                  </div>"""

content = re.sub(
    r"(<div className=\"bg-\[#2c2c2e\] rounded-3xl \[corner-shape:superellipse\(1\.82\)\] p-4 space-y-4\">\s*<div className=\"flex items-start justify-between gap-4\">\s*<div>\s*<h3 className=\"text-white font-medium mb-1\">Wikimedia Asset Fetching</h3>)",
    ui_code + "\n                  \\1",
    content
)

with open('src/components/SettingsModal.tsx', 'w') as f:
    f.write(content)
