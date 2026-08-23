const { execSync } = require('child_process');
try {
  const css = execSync('npx tailwindcss -i ./src/index.css -c ./tailwind.config.js 2>/dev/null', { encoding: 'utf8' });
  console.log(css.includes('inset_0_1px_1px_rgba(255,255,255,0.4)'));
} catch (e) {
  console.log("Error running tailwind");
}
