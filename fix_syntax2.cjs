const fs = require('fs');
let content = fs.readFileSync('src/data/extendedData.ts', 'utf8');
content = content.replace(/architecture\?: string;/, 'architecture?: string[];');
content = content.replace(/title: 'Machine Learning Specialization',/, "name: 'Machine Learning Specialization',\n      logo: 'Brain',");
content = content.replace(/title: 'Google Cloud Certified',/, "name: 'Google Cloud Certified',\n      logo: 'Cloud',");
content = content.replace(/issueDate:/g, 'date:');
content = content.replace(/skills:/g, 'skillsLearned:');
fs.writeFileSync('src/data/extendedData.ts', content, 'utf8');
