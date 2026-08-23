const fs = require('fs');
let code = fs.readFileSync('src/components/ChatPanel.tsx', 'utf8');

const targetStr = `                      </Markdown>
                    </div>
                  </div>
                </div>`;

const replacementStr = `                      </Markdown>
                    </div>

                    {/* Diffs Section */}
                    {msg.diffs && msg.diffs.length > 0 && (
                      <div className="mt-4 bg-[#141414] border border-[#2a2a2a] rounded-xl overflow-hidden">
                        <div className="bg-[#1a1a1a] border-b border-[#2a2a2a] px-3 py-1.5 flex items-center gap-2">
                          <CheckCircle size={12} className="text-emerald-500" />
                          <span className="text-[11px] font-semibold tracking-wider text-neutral-400 uppercase">Synced Updates</span>
                        </div>
                        <div className="divide-y divide-[#2a2a2a]">
                          {msg.diffs.map((diff, idx) => (
                            <div key={idx} className="flex items-center justify-between px-3 py-2">
                              <span className="text-xs font-mono text-neutral-300 truncate pr-4">{diff.path}</span>
                              <div className="flex items-center gap-3 shrink-0">
                                {diff.linesAdded > 0 && (
                                  <span className="text-[11px] font-mono text-emerald-400">+{diff.linesAdded} lines</span>
                                )}
                                {diff.linesRemoved > 0 && (
                                  <span className="text-[11px] font-mono text-rose-400">-{diff.linesRemoved} lines</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>`;

if (code.includes(targetStr)) {
    code = code.replace(targetStr, replacementStr);
    fs.writeFileSync('src/components/ChatPanel.tsx', code);
    console.log("Patched correctly");
} else {
    console.log("Could not find target string.");
}
