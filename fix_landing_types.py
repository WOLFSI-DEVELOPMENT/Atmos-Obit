import re
import glob

for filename in glob.glob('src/components/*.tsx'):
    with open(filename, 'r') as f:
        content = f.read()
        
    updated = re.sub(
        r"onNavigate\??: \(\s*view\s*:\s*'landing' \| 'app' \| 'privacy' \| 'terms' \| 'blog' \| 'pricing' \| 'auth'\s*\) => void;",
        "onNavigate?: (view: 'landing' | 'app' | 'privacy' | 'terms' | 'blog' | 'pricing' | 'auth' | 'articles') => void;",
        content
    )
    
    updated = re.sub(
        r"onNavigate\??: \(\s*view\s*:\s*'landing' \| 'app' \| 'privacy' \| 'terms' \| 'blog' \| 'pricing' \| 'auth' \| 'articles'\s*\) => void;",
        "onNavigate: (view: 'landing' | 'app' | 'privacy' | 'terms' | 'blog' | 'pricing' | 'auth' | 'articles') => void;",
        updated
    )
    
    # Handle optional correctly
    if 'LandingPage' in filename:
        updated = updated.replace("onNavigate: (view", "onNavigate?: (view")
        
    if content != updated:
        with open(filename, 'w') as f:
            f.write(updated)
            print(f"Updated {filename}")

