const fs = require('fs');
let code = fs.readFileSync('src/components/LandingPage.tsx', 'utf8');

// Feature 1
code = code.replace(
  '<div className="w-full h-56 bg-gradient-to-br from-[#1c1410] to-[#111111] rounded-xl mb-6 relative overflow-hidden">\n                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/20 blur-[70px] rounded-full -translate-y-1/2 translate-x-1/3"></div>',
  '<div className="w-full h-56 bg-[#111] rounded-xl mb-6 relative overflow-hidden">\n                <img src="https://res.cloudinary.com/dwthgcx5j/image/upload/v1787179206/Abstract_gradient_background_202608191639_1_tqihzn.jpg" className="absolute inset-0 w-full h-full object-cover opacity-90" alt="Background" />'
);

// Feature 2
code = code.replace(
  '<div className="w-full h-56 bg-gradient-to-br from-[#1a1224] to-[#111111] rounded-xl mb-6 relative overflow-hidden">\n                <div className="absolute top-0 left-0 w-64 h-64 bg-fuchsia-500/20 blur-[70px] rounded-full -translate-y-1/3 -translate-x-1/4"></div>',
  '<div className="w-full h-56 bg-[#111] rounded-xl mb-6 relative overflow-hidden">\n                <img src="https://res.cloudinary.com/dwthgcx5j/image/upload/v1787179183/Abstract_gradient_background_ble__202608191639_pqhfka.jpg" className="absolute inset-0 w-full h-full object-cover opacity-90" alt="Background" />'
);

// Feature 3
code = code.replace(
  '<div className="w-full h-56 bg-gradient-to-br from-[#241216] to-[#111111] rounded-xl mb-6 relative overflow-hidden">\n                <div className="absolute top-0 left-0 w-64 h-64 bg-rose-500/20 blur-[70px] rounded-full -translate-y-1/2 translate-x-1/4"></div>',
  '<div className="w-full h-56 bg-[#111] rounded-xl mb-6 relative overflow-hidden">\n                <img src="https://res.cloudinary.com/dwthgcx5j/image/upload/v1787179178/Abstract_gradient_background_202608191639_kyhqnu.jpg" className="absolute inset-0 w-full h-full object-cover opacity-90" alt="Background" />'
);

fs.writeFileSync('src/components/LandingPage.tsx', code);
console.log("Patched feature backgrounds");
