import re

# PATCH App.tsx
with open("src/App.tsx", "r") as f:
    app_code = f.read()

app_old_btn = r"""                    <button 
                      type="submit"
                      disabled=\{isGenerating \|\| !newProjectName\.trim\(\)\}
                      className=\{`w-9 h-9 disabled:opacity-50 text-black rounded-lg flex items-center justify-center shrink-0 \$\{sendBtn3D \? '[^`]+' : '[^`]+'`\}
                      style=\{\{ backgroundColor: sendBtnColor \}\}
                      title="Create project"
                    >
                      <ArrowUpRight className="w-5 h-5 text-black" />
                    </button>"""

app_new_btn = """                    {sendBtn3D ? (
                      <div 
                        className="w-9 h-[40px] rounded-lg relative"
                        style={{ backgroundColor: sendBtnColor }}
                      >
                        <div className="absolute inset-0 bg-black/30 rounded-lg"></div>
                        <button 
                          type="submit"
                          disabled={isGenerating || !newProjectName.trim()}
                          className="absolute top-0 left-0 w-9 h-9 disabled:opacity-50 text-black rounded-lg flex items-center justify-center transition-transform duration-75 active:translate-y-[4px]"
                          style={{ backgroundColor: sendBtnColor }}
                          title="Create project"
                        >
                          <ArrowUpRight className="w-5 h-5 text-black" />
                        </button>
                      </div>
                    ) : (
                      <button 
                        type="submit"
                        disabled={isGenerating || !newProjectName.trim()}
                        className="w-9 h-9 disabled:opacity-50 text-black rounded-lg flex items-center justify-center shadow-sm hover:brightness-125 transition-all"
                        style={{ backgroundColor: sendBtnColor }}
                        title="Create project"
                      >
                        <ArrowUpRight className="w-5 h-5 text-black" />
                      </button>
                    )}"""

app_code = re.sub(app_old_btn, app_new_btn, app_code)
with open("src/App.tsx", "w") as f:
    f.write(app_code)

# PATCH ChatPanel.tsx
with open("src/components/ChatPanel.tsx", "r") as f:
    chat_code = f.read()

chat_old_btn = r"""              <button 
                onClick=\{\(\) => handleSend\(\)\}
                disabled=\{isLoading \|\| !input\.trim\(\)\}
                className=\{`w-9 h-9 disabled:opacity-50 text-black rounded-lg flex items-center justify-center shrink-0 \$\{sendBtn3D \? '[^`]+' : '[^`]+'`\}
                style=\{\{ backgroundColor: sendBtnColor \}\}
                title="Send message"
              >
                <ArrowUpRight className="w-5 h-5 text-black" />
              </button>"""

chat_new_btn = """              {sendBtn3D ? (
                <div 
                  className="w-9 h-[40px] rounded-lg relative shrink-0"
                  style={{ backgroundColor: sendBtnColor }}
                >
                  <div className="absolute inset-0 bg-black/30 rounded-lg"></div>
                  <button 
                    onClick={() => handleSend()}
                    disabled={isLoading || !input.trim()}
                    className="absolute top-0 left-0 w-9 h-9 disabled:opacity-50 text-black rounded-lg flex items-center justify-center transition-transform duration-75 active:translate-y-[4px]"
                    style={{ backgroundColor: sendBtnColor }}
                    title="Send message"
                  >
                    <ArrowUpRight className="w-5 h-5 text-black" />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => handleSend()}
                  disabled={isLoading || !input.trim()}
                  className="w-9 h-9 disabled:opacity-50 text-black rounded-lg flex items-center justify-center shrink-0 shadow-sm transition-all"
                  style={{ backgroundColor: sendBtnColor }}
                  title="Send message"
                >
                  <ArrowUpRight className="w-5 h-5 text-black" />
                </button>
              )}"""

chat_code = re.sub(chat_old_btn, chat_new_btn, chat_code)
with open("src/components/ChatPanel.tsx", "w") as f:
    f.write(chat_code)

print("Done patching!")
