import re

with open('server.ts', 'r') as f:
    content = f.read()

content = re.sub(
    r"const \{ message, pin, image, model, apiKey, baseUrl, thinkingConfig, allowToolbox, allowIconGen, assetPreference, responseTone, guiStyle, orchestratorEnabled \} = req\.body;",
    "const { message, pin, image, model, apiKey, baseUrl, thinkingConfig, allowToolbox, allowIconGen, assetPreference, responseTone, guiStyle, orchestratorEnabled, guiCreationEnabled } = req.body;",
    content
)

gui_instruction = """
    let guiInstruction = '';
    if (guiCreationEnabled) {
      guiInstruction = `\\n\\nCRITICAL PREFERENCE: You have access to "GUI Creation v1". You are encouraged to create the best, fully functional GUI possible. You can even build entire games out of pure GUI (e.g., clicker games, idle games, menu-based RPGs). When generating UI, use modern, aesthetic, responsive practices in Roblox. Use UIListLayout, UICorner, UIPadding, gradients, and proper scaling. Your primary tool for this is outputting "Command" objects that generate these ScreenGuis and LocalScripts inside StarterGui.`;
    }
"""

content = re.sub(
    r"const behaviorInstructions = \[toneInstruction, styleInstruction\]\.filter\(Boolean\)\.map\(i => `\\n\\nCRITICAL PREFERENCE: \$\{i\}`\)\.join\(''\);",
    "const behaviorInstructions = [toneInstruction, styleInstruction].filter(Boolean).map(i => `\\n\\nCRITICAL PREFERENCE: ${i}`).join('');\n" + gui_instruction,
    content
)

content = re.sub(
    r"\$\{assetInstruction\}\$\{behaviorInstructions\}",
    "${assetInstruction}${behaviorInstructions}${guiInstruction}",
    content
)

with open('server.ts', 'w') as f:
    f.write(content)
