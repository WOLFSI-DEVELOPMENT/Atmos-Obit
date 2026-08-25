import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Add import for HomeLayout
if "import { HomeLayout }" not in content:
    content = content.replace(
        "import { ArtifactsPanel } from './components/ArtifactsPanel';",
        "import { ArtifactsPanel } from './components/ArtifactsPanel';\nimport { HomeLayout } from './components/HomeLayout';"
    )

# Add betaHomeLayout state
if "betaHomeLayout" not in content:
    state_block = """  const [betaHomeLayout, setBetaHomeLayout] = useState(() => {
    return localStorage.getItem('vibecoder_beta_home_layout') === 'true';
  });"""
    content = content.replace(
        "const [artifactsEnabled, setArtifactsEnabled]",
        state_block + "\n  const [artifactsEnabled, setArtifactsEnabled]"
    )

    # Sync state in useEffect
    sync_block = """      setSendBtnColor(localStorage.getItem('vibecoder_send_btn_color') || '#b0b0b0');
      setBetaHomeLayout(localStorage.getItem('vibecoder_beta_home_layout') === 'true');"""
    content = content.replace(
        "setSendBtnColor(localStorage.getItem('vibecoder_send_btn_color') || '#b0b0b0');",
        sync_block
    )

# Add handler for sending message from HomeLayout
if "handleHomeSendMessage" not in content:
    handler = """  const handleHomeSendMessage = (prompt: string, projId: string | null) => {
    if (projId) {
      setActiveProjectId(projId);
      // Let ChatPanel handle the prompt (we need to pass it to ChatPanel somehow)
      // For now, we will set it in local storage so ChatPanel can pick it up
      localStorage.setItem('vibecoder_initial_prompt', prompt);
    } else {
      // Create new project and send
      handleCreateProject(undefined, prompt);
    }
  };"""
    content = content.replace("const handleCreateProject = async", handler + "\n\n  const handleCreateProject = async")

    # Update handleCreateProject to accept initialPrompt
    content = content.replace(
        "const handleCreateProject = async (e?: React.FormEvent) => {",
        "const handleCreateProject = async (e?: React.FormEvent, initialPrompt?: string, file?: File | null) => {"
    )

    # If initialPrompt is provided, add it to the messages
    content = content.replace(
        "messages: [",
        "messages: initialPrompt ? [{role: 'user', content: initialPrompt}, {role: 'model', content: `Project created! Processing: ${initialPrompt}`}] : ["
    )

# Render HomeLayout when !activeProjectId
old_render = """          {/* Chat Panel */}
          {activeProject && (
            <ChatPanel"""
            
new_render = """          {/* Home Layout */}
          {!activeProject && betaHomeLayout && (
            <HomeLayout
              projects={projects}
              activeProjectId={activeProjectId}
              onSelectProject={handleSelectProject}
              onCreateProject={(name, file) => {
                newProjectName = name;
                handleCreateProject(undefined, undefined, file);
              }}
              onSendMessage={handleHomeSendMessage}
              selectedModel={selectedModel}
              onModelChange={setSelectedModel}
              isListening={isHomeListening}
              toggleSpeechRecognition={toggleHomeSpeechRecognition}
              input={input}
              setInput={setInput}
              sendBtnColor={sendBtnColor}
            />
          )}

          {/* Chat Panel */}
          {activeProject && (
            <ChatPanel"""
            
content = content.replace(old_render, new_render)

# Add betaHomeLayout to SettingsModal props
if "betaHomeLayout={betaHomeLayout}" not in content:
    content = content.replace(
        "          onLogout={async () => {",
        "          betaHomeLayout={betaHomeLayout}\n          onBetaHomeLayoutChange={(val) => {\n            setBetaHomeLayout(val);\n            localStorage.setItem('vibecoder_beta_home_layout', val.toString());\n          }}\n          onLogout={async () => {"
    )

with open('src/App.tsx', 'w') as f:
    f.write(content)

