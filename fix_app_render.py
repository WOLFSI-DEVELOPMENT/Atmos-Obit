import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

old = "          {activeProject ? ("

new = """          {!activeProject && betaHomeLayout ? (
            <HomeLayout
              projects={projects}
              activeProjectId={activeProjectId}
              onSelectProject={handleSelectProject}
              onCreateProject={(name, file) => {
                handleCreateProject(undefined, undefined, file, name);
              }}
              onSendMessage={handleHomeSendMessage}
              selectedModel={selectedModel}
              onModelChange={setSelectedModel}
              isListening={isHomeListening}
              toggleSpeechRecognition={toggleHomeSpeechRecognition}
              input={newProjectName}
              setInput={setNewProjectName}
              sendBtnColor={sendBtnColor}
            />
          ) : activeProject ? ("""

content = content.replace(old, new)

with open('src/App.tsx', 'w') as f:
    f.write(content)
