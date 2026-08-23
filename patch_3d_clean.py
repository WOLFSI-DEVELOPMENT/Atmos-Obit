import re

def patch_file(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    # The current string to replace
    # We will replace the whole className string
    
    new_cond_3d = "'shadow-[0_4px_0_#000000,inset_0_1px_1px_rgba(255,255,255,0.4)] active:shadow-[0_0px_0_#000000,inset_0_1px_1px_rgba(255,255,255,0.4)] active:translate-y-[4px] transition-transform duration-75'"
    
    # For ChatPanel:
    chat_old = r"shrink-0 \$\{sendBtn3D \? 'mb-1 shadow-\[0_4px_0_rgba\(0,0,0,0\.6\),inset_0_1px_1px_rgba\(255,255,255,0\.3\)\] active:shadow-\[0_0px_0_rgba\(0,0,0,0\.6\),inset_0_1px_1px_rgba\(255,255,255,0\.3\)\] active:translate-y-\[4px\] transition-transform duration-75' : 'shadow-sm transition-all'\}"
    chat_new = f"shrink-0 ${{sendBtn3D ? {new_cond_3d} : 'shadow-sm transition-all'}}"
    
    # For App:
    app_old = r"shrink-0 \$\{sendBtn3D \? 'mb-1 shadow-\[0_4px_0_rgba\(0,0,0,0\.6\),inset_0_1px_1px_rgba\(255,255,255,0\.3\)\] active:shadow-\[0_0px_0_rgba\(0,0,0,0\.6\),inset_0_1px_1px_rgba\(255,255,255,0\.3\)\] active:translate-y-\[4px\] transition-transform duration-75' : 'shadow-sm hover:brightness-125 transition-all'\}"
    app_new = f"shrink-0 ${{sendBtn3D ? {new_cond_3d} : 'shadow-sm hover:brightness-125 transition-all'}}"
    
    if "ChatPanel" in filepath:
        content = re.sub(chat_old, chat_new, content)
    elif "App" in filepath:
        content = re.sub(app_old, app_new, content)
        
    with open(filepath, "w") as f:
        f.write(content)

patch_file("src/components/ChatPanel.tsx")
patch_file("src/App.tsx")
print("Patched Clean")
