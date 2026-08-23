const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetReturn = `  return (
    <div className="h-screen w-full bg-[#1c1c1c] flex font-sans overflow-hidden text-white selection:bg-neutral-800">`;

const newReturn = `  if (view === 'landing') {
    return <LandingPage onEnterApp={() => setView('app')} />;
  }

  return (
    <div className="h-screen w-full bg-[#1c1c1c] flex font-sans overflow-hidden text-white selection:bg-neutral-800">`;

if (code.includes(targetReturn)) {
    code = code.replace(targetReturn, newReturn);
    fs.writeFileSync('src/App.tsx', code);
    console.log("Patched render correctly");
} else {
    console.log("Could not find return target");
}
