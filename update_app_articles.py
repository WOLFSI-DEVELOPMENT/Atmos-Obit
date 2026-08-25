import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Add 'articles' to the view type
content = re.sub(
    r"const \[view, setView\] = useState\<'landing' \| 'app' \| 'privacy' \| 'terms' \| 'blog' \| 'pricing' \| 'auth'\>",
    "const [view, setView] = useState<'landing' | 'app' | 'privacy' | 'terms' | 'blog' | 'pricing' | 'auth' | 'articles'>",
    content
)

# Add to path check
content = content.replace(
    "if (path === '/blog') return 'blog';",
    "if (path === '/blog') return 'blog';\n    if (path === '/articles') return 'articles';"
)

content = content.replace(
    "else if (path === '/blog') setView('blog');",
    "else if (path === '/blog') setView('blog');\n      else if (path === '/articles') setView('articles');"
)

# Add ArticlesPage import (assume it will be there)
content = content.replace(
    "import { BlogPage } from './components/BlogPage';",
    "import { BlogPage } from './components/BlogPage';\nimport { ArticlesPage } from './components/ArticlesPage';"
)

# Add the render route
content = content.replace(
    "{view === 'blog' && <BlogPage onNavigate={handleNavigate} />}",
    "{view === 'blog' && <BlogPage onNavigate={handleNavigate} />}\n        {view === 'articles' && <ArticlesPage onNavigate={handleNavigate} />}"
)

with open('src/App.tsx', 'w') as f:
    f.write(content)
