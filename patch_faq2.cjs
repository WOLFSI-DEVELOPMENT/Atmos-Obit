const fs = require('fs');
let code = fs.readFileSync('src/components/LandingPage.tsx', 'utf8');

const startIdx = code.indexOf('{/* FAQ Section */}');
const endIdx = code.indexOf('{/* Cinematic CTA Section */}');

const faqSection = `{/* FAQ Section */}
      <div className="relative w-full bg-black py-32 px-6 md:px-12 flex flex-col items-center z-20">
        <div className="w-full max-w-[840px] mx-auto">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-16 text-center"
          >
            <h2 className="text-[36px] md:text-[48px] font-semibold tracking-tight text-white mb-4">
              Frequently asked questions
            </h2>
            <p className="text-[#8a8a8a] text-[18px]">
              Everything you need to know about building with Atmos Orbit.
            </p>
          </motion.div>

          <div className="flex flex-col gap-4">
            {[
              {
                q: "Does this work with my existing Roblox games?",
                a: "Yes! Atmos Orbit integrates seamlessly into your current Roblox Studio workflow. You can easily insert new AI-generated systems or modify existing scripts without breaking your game's structure."
              },
              {
                q: "How does the Live Studio Sync work?",
                a: "We provide a secure, lightweight Roblox Studio plugin. By entering the 6-digit PIN from your Atmos Orbit dashboard, your web workspace securely bridges directly to your live Studio session to push code and assets instantly."
              },
              {
                q: "Are the generated scripts optimized for Luau?",
                a: "Absolutely. Our engine is specifically fine-tuned for Roblox's Luau environment, producing highly performant, server-client authoritative code that follows standard DataModel architectures and best practices."
              },
              {
                q: "Can I fetch custom 3D models and UI?",
                a: "Yes! Our Smart Asset Fetching lets you query the Creator Marketplace directly through conversational prompts. It automatically finds safe, high-quality models, sounds, and UI elements and places them into your workspace."
              }
            ].map((faq, index) => {
              const [isOpen, setIsOpen] = React.useState(false);
              return (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="w-full"
                >
                  <div className="bg-[#111111] rounded-[20px] overflow-hidden transition-colors hover:bg-[#161616]">
                    <button
                      onClick={() => setIsOpen(!isOpen)}
                      className="w-full px-8 py-6 flex items-center justify-between text-left focus:outline-none"
                    >
                      <span className="text-[18px] font-medium text-white/95">{faq.q}</span>
                      <motion.div
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="text-white/40 flex-shrink-0 ml-4"
                      >
                        <Plus size={22} strokeWidth={2} />
                      </motion.div>
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                          <div className="px-8 pb-8 pt-2 text-[#8a8a8a] text-[16px] leading-relaxed">
                            {faq.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>\n\n      `;

if (startIdx !== -1 && endIdx !== -1) {
  code = code.substring(0, startIdx) + faqSection + code.substring(endIdx);
  fs.writeFileSync('src/components/LandingPage.tsx', code);
  console.log("Updated FAQ");
} else if (endIdx !== -1) {
  code = code.substring(0, endIdx) + faqSection + code.substring(endIdx);
  fs.writeFileSync('src/components/LandingPage.tsx', code);
  console.log("Inserted FAQ");
} else {
  console.log("Could not find insertion point");
}
