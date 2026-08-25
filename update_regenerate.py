import re

with open('src/components/ChatPanel.tsx', 'r') as f:
    chat_content = f.read()

event_listener = """
  useEffect(() => {
    const handleRegenerate = () => {
      handleSend("Regenerate the code based on my previous instructions");
    };
    window.addEventListener('regenerate-code', handleRegenerate);
    return () => window.removeEventListener('regenerate-code', handleRegenerate);
  }, [input, isLoading, project.messages]);
"""

# Insert right before the return statement of ChatPanel
chat_content = chat_content.replace('return (\n    <div className="flex-1 bg-black', event_listener + '\n  return (\n    <div className="flex-1 bg-black')

with open('src/components/ChatPanel.tsx', 'w') as f:
    f.write(chat_content)

with open('src/components/ArtifactsPanel.tsx', 'r') as f:
    artifacts_content = f.read()

# Replace the "Refresh Code" button to dispatch the event
artifacts_content = artifacts_content.replace(
    '''<button onClick={() => { setIsExportDropdownOpen(false); fetchFiles(); }} className="w-full text-left px-4 py-2.5 text-sm text-neutral-300 hover:text-white hover:bg-white/10 flex items-center gap-2 transition-colors">
                     <RefreshCw size={14} /> Refresh Code
                   </button>''',
    '''<button onClick={() => { setIsExportDropdownOpen(false); window.dispatchEvent(new CustomEvent('regenerate-code')); }} className="w-full text-left px-4 py-2.5 text-sm text-neutral-300 hover:text-white hover:bg-white/10 flex items-center gap-2 transition-colors">
                     <RefreshCw size={14} /> Regenerate Code
                   </button>'''
)

artifacts_content = artifacts_content.replace(
    '''<button onClick={fetchFiles} className="hover:text-white transition-colors" title="Refresh Code">''',
    '''<button onClick={() => window.dispatchEvent(new CustomEvent('regenerate-code'))} className="hover:text-white transition-colors" title="Regenerate Code">'''
)

with open('src/components/ArtifactsPanel.tsx', 'w') as f:
    f.write(artifacts_content)

