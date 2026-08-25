import re

with open('src/components/ChatPanel.tsx', 'r') as f:
    content = f.read()

if "vibecoder_initial_prompt" not in content:
    # Add a check in useEffect
    use_effect = """  useEffect(() => {
    const initPrompt = localStorage.getItem('vibecoder_initial_prompt');
    if (initPrompt && !isLoading) {
      localStorage.removeItem('vibecoder_initial_prompt');
      setInput(initPrompt);
      setTimeout(() => {
        // Find send button or just call handleSend
        // Wait, handleSend needs input state to be updated, which is async.
        // We can just call onSendMessage directly.
        onSendMessage([
          ...project.messages,
          { role: 'user', content: initPrompt }
        ]);
        // And then trigger the model... this is getting complex.
      }, 100);
    }
  }, [project.id]);"""
    
    # We can just set the input, and let the user press send. Or we can auto send.
    # The prompt says "work on in a new chat but will all files synced",
    # If we just pre-fill the input box, that might be easiest and least bug-prone.
    
    pre_fill = """  useEffect(() => {
    const initPrompt = localStorage.getItem('vibecoder_initial_prompt');
    if (initPrompt) {
      setInput(initPrompt);
      localStorage.removeItem('vibecoder_initial_prompt');
    }
  }, [project.id]);"""
    
    content = content.replace("  const [isSidebarOpen, setIsSidebarOpen] = useState(false);", "  const [isSidebarOpen, setIsSidebarOpen] = useState(false);\n" + pre_fill)

with open('src/components/ChatPanel.tsx', 'w') as f:
    f.write(content)
