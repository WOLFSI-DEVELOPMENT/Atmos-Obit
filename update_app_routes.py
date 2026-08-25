import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

route_state = """
  const [view, setView] = useState<'landing' | 'app' | 'privacy' | 'terms' | 'blog' | 'pricing' | 'auth'>(() => {
    const path = window.location.pathname;
    if (path === '/app') return 'app';
    if (path === '/privacy') return 'privacy';
    if (path === '/terms') return 'terms';
    if (path === '/blog') return 'blog';
    if (path === '/pricing') return 'pricing';
    if (path === '/auth') return 'auth';
    return 'landing';
  });

  const handleNavigate = (newView: typeof view) => {
    setView(newView);
    const path = newView === 'landing' ? '/' : `/${newView}`;
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/app') setView('app');
      else if (path === '/privacy') setView('privacy');
      else if (path === '/terms') setView('terms');
      else if (path === '/blog') setView('blog');
      else if (path === '/pricing') setView('pricing');
      else if (path === '/auth') setView('auth');
      else setView('landing');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
"""

content = re.sub(
    r"const \[view, setView\] = useState<'landing' \| 'app' \| 'privacy' \| 'terms' \| 'blog' \| 'pricing' \| 'auth'>\('landing'\);",
    route_state.strip(),
    content
)

content = content.replace("setView('app');", "handleNavigate('app');")
content = content.replace("setView('auth');", "handleNavigate('auth');")
content = content.replace("onNavigate={setView}", "onNavigate={handleNavigate}")
content = content.replace("onEnterApp={() => setView('auth')}", "onEnterApp={() => handleNavigate('auth')}")

with open('src/App.tsx', 'w') as f:
    f.write(content)

