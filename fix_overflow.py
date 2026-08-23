import re

with open("src/components/SettingsModal.tsx", "r") as f:
    content = f.read()

# Replace all instances of `[corner-shape:superellipse(1.82)] overflow-hidden` 
# with `[corner-shape:superellipse(1.82)]`
content = content.replace("[corner-shape:superellipse(1.82)] overflow-hidden", "[corner-shape:superellipse(1.82)]")

# Wait, there's another one: `relative overflow-hidden` (line 342, 484, etc)
# Let's not touch those unless necessary.

with open("src/components/SettingsModal.tsx", "w") as f:
    f.write(content)
print("Done")
