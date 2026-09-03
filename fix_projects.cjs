const fs = require('fs');
let content = fs.readFileSync('src/components/ProjectsShowcase.tsx', 'utf8');

// Replace activeProject.<prop>.map with activeProject.<prop>?.map
content = content.replace(/activeProject\.objectives\.map/g, 'activeProject.objectives?.map');
content = content.replace(/activeProject\.techStack\.map/g, 'activeProject.techStack?.map');
content = content.replace(/activeProject\.metrics\.map/g, 'activeProject.metrics?.map');
content = content.replace(/activeProject\.features\.map/g, 'activeProject.features?.map');
content = content.replace(/activeProject\.architecture\.map/g, 'activeProject.architecture?.map');
content = content.replace(/activeProject\.challenges\.map/g, 'activeProject.challenges?.map');
content = content.replace(/activeProject\.solutions\.map/g, 'activeProject.solutions?.map');
content = content.replace(/activeProject\.lessonsLearned\.map/g, 'activeProject.lessonsLearned?.map');
content = content.replace(/activeProject\.futureImprovements\.map/g, 'activeProject.futureImprovements?.map');
content = content.replace(/activeProject\.timeline\.map/g, 'activeProject.timeline?.map');

fs.writeFileSync('src/components/ProjectsShowcase.tsx', content, 'utf8');
