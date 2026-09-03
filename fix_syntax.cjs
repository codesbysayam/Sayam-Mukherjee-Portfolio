const fs = require('fs');
let content = fs.readFileSync('src/data/extendedData.ts', 'utf8');
content = content.replace(/\};\n\}/, '}');
fs.writeFileSync('src/data/extendedData.ts', content, 'utf8');
