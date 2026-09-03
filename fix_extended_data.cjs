const fs = require('fs');
let content = fs.readFileSync('src/data/extendedData.ts', 'utf8');

// Insert experience before achievements
content = content.replace(/export const EXTENDED_DATA = \{/, `export const EXTENDED_DATA = {
  experience: [
    {
      type: 'Freelancing',
      role: 'Freelancer',
      company: 'Self-Employed',
      period: '2023 - Present',
      description: ['Built various projects and helped clients solve their problems.'],
      skills: ['React', 'Node.js']
    },
    {
      type: 'Content Creation',
      role: 'Content Creator',
      company: 'YouTube',
      period: '2023 - Present',
      description: ['Shared technical knowledge on YouTube.'],
      skills: ['Video Editing', 'Content Strategy']
    },
    {
      type: 'Volunteer',
      role: 'Volunteer',
      company: 'Labs',
      period: '2024',
      description: ['Volunteered at college labs.'],
      skills: ['Leadership']
    },
    {
      type: 'Open Source',
      role: 'Contributor',
      company: 'Open Source',
      period: '2023 - Present',
      description: ['Contributed to multiple open-source repositories.'],
      skills: ['Git', 'Collaboration']
    }
  ] as any[],`);

fs.writeFileSync('src/data/extendedData.ts', content, 'utf8');
