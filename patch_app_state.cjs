const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetState = `  const [activeProjectId, setActiveProjectId] = useState<string | null>(() => {`;
const newState = `  const [view, setView] = useState<'landing' | 'app'>('landing');
  const [activeProjectId, setActiveProjectId] = useState<string | null>(() => {`;

if (code.includes(targetState)) {
    code = code.replace(targetState, newState);
} else {
    console.log("Could not find target state");
}

fs.writeFileSync('src/App.tsx', code);
