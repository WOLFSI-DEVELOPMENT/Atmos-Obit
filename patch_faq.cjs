const fs = require('fs');
let code = fs.readFileSync('src/components/LandingPage.tsx', 'utf8');

// Ensure AnimatePresence is imported
if (!code.includes('AnimatePresence')) {
  code = code.replace(/import { motion([^\}]*)} from 'motion\/react';/, "import { motion$1, AnimatePresence } from 'motion/react';");
}

// Ensure Plus is imported if not already
if (!code.includes('Plus,')) {
  code = code.replace(/import { Sparkles([^}]*)} from 'lucide-react';/, "import { Sparkles$1, Plus } from 'lucide-react';");
}

// Add state
if (!code.includes('const [openFaq, setOpenFaq]')) {
  code = code.replace(
    /const \[input, setInput\] = useState\(''\);/,
    `const [input, setInput] = useState('');\n  const [openFaq, setOpenFaq] = useState<number | null>(null);\n\n  const faqs = [\n    {\n      question: "Can I export my game to Roblox Studio?",\n      answer: "Yes, you can use our live Studio sync plugin to push AI-generated scripts and systems directly into your Roblox Studio place via a secure PIN."\n    },\n    {\n      question: "Does the AI generate 3D models?",\n      answer: "Instead of generating low-quality 3D models, our AI smartly searches the official Roblox Creator Marketplace to fetch high-quality, safe, and free assets to integrate into your game."\n    },\n    {\n      question: "Do I need to know how to code in Luau?",\n      answer: "Not at all. You just describe the mechanics in plain English. Our Surgical Code Engine writes, edits, and structures the Luau scripts for you without breaking your existing game."\n    },\n    {\n      question: "Is this free to use?",\n      answer: "You can start building and generating systems for free. We also offer premium plans for unlimited generations and advanced capabilities."\n    }\n  ];`
  );
}

const faqSection = `
      {/* FAQ Section */}
      <div className="relative w-full bg-[#0a0a0a] py-32 px-6 md:px-12 flex flex-col items-center z-20 border-t border-white/5">
        <div className="w-full max-w-[800px] mx-auto">
          
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-12 text-center"
          >
            <h2 className="text-[32px] md:text-[40px] font-medium tracking-tight text-white mb-3">
              Frequently Asked Questions
            </h2>
            <p className="text-[#a0a0a0] text-[17px]">
              Everything you need to know about building with Atmos Orbit.
            </p>
          </motion.div>

          {/* Accordion List */}
          <div className="flex flex-col gap-3">
            {faqs.map((faq, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
                className="bg-[#111111] hover:bg-[#161616] transition-colors rounded-2xl overflow-hidden cursor-pointer flex flex-col"
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
              >
                <div className="px-6 py-5 flex items-center justify-between select-none">
                  <h3 className="text-[17px] font-medium text-white">{faq.question}</h3>
                  <motion.div 
                    animate={{ rotate: openFaq === index ? 45 : 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="w-7 h-7 rounded-full bg-[#1c1c1c] flex items-center justify-center text-[#8a8a8a] shrink-0 ml-4"
                  >
                    <Plus size={16} strokeWidth={2.5} />
                  </motion.div>
                </div>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 text-[#8a8a8a] text-[15px] leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
`;

if (!code.includes('FAQ Section')) {
  code = code.replace('{/* Cinematic CTA Section */}', faqSection + '\n      {/* Cinematic CTA Section */}');
  fs.writeFileSync('src/components/LandingPage.tsx', code);
  console.log('Patched FAQ');
} else {
  console.log('FAQ already exists');
}
