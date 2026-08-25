import re

with open('src/components/HomeLayout.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "import { Cloud, Search, Plus, Mic, MicOff, Folder, Code, Terminal, Upload, X, RefreshCw, Bug, Check, ChevronDown } from 'lucide-react';",
    "import { Cloud, Search, Plus, Mic, MicOff, Folder, Code, Terminal, Upload, X, RefreshCw, Bug, Check, ChevronDown, Monitor, GitBranch } from 'lucide-react';"
)

with open('src/components/HomeLayout.tsx', 'w') as f:
    f.write(content)
