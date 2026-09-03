const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const footerReplacement = `              {/* Copyright + Actions */}
              <div className="flex items-center gap-4">
                <p className="font-mono text-[10px] text-zinc-600 hidden md:block">© 2026 Sayam Mukherjee. All rights reserved.</p>
                <button
                  onClick={() => setReadingMode(!readingMode)}
                  className={\`p-2 border rounded-lg transition-all cursor-pointer \${
                    readingMode 
                      ? "bg-orange-500/10 border-orange-500/30 text-orange-400 hover:bg-orange-500/20" 
                      : "bg-zinc-900 hover:bg-zinc-800 border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white"
                  }\`}
                  title="Toggle Eye-Care Reading Mode"
                >
                  <Glasses className="w-4 h-4" />
                </button>
                <button
                  onClick={toggleTheme}
                  className="p-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white rounded-lg transition-all cursor-pointer"
                  title="Toggle System Visual Theme"
                >
                  {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
                </button>
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className="p-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 rounded-lg cursor-pointer"
                  title="Return to top coordinate"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
              </div>`;

content = content.replace(/\{\/\* Copyright \+ Arrow Up \*\/\}\s*<div className="flex items-center gap-4">\s*<p className="font-mono text-\[10px\] text-zinc-600">© 2026 Sayam Mukherjee. All rights reserved.<\/p>\s*<button\s*onClick=\{\(\) => window.scrollTo\(\{ top: 0, behavior: "smooth" \}\)\}\s*className="p-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 rounded-lg cursor-pointer"\s*title="Return to top coordinate"\s*>\s*<ArrowUp className="w-4 h-4" \/>\s*<\/button>\s*<\/div>/, footerReplacement);

fs.writeFileSync('src/App.tsx', content, 'utf8');
