/**
 * Build Manifest & Metadata Generator
 * -----------------------------------
 * Pre-build validation and build-manifest generation script.
 * Reads repository configuration, project registry, and generates a static
 * runtime metadata manifest in public/build-manifest.json.
 */

import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';
import { transformSync } from 'esbuild';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, '..');
const PROJECTS_TS_PATH = path.join(ROOT_DIR, 'src', 'data', 'projects.ts');
const METADATA_PATH = path.join(ROOT_DIR, 'metadata.json');
const PACKAGE_PATH = path.join(ROOT_DIR, 'package.json');
const OUTPUT_PATH = path.join(ROOT_DIR, 'public', 'build-manifest.json');

function loadVerifiedProjects() {
  if (!fs.existsSync(PROJECTS_TS_PATH)) {
    console.error(`[Build Tooling Error] Authoritative projects registry not found at ${PROJECTS_TS_PATH}`);
    process.exit(1);
  }

  const tsSource = fs.readFileSync(PROJECTS_TS_PATH, 'utf-8');
  const compiled = transformSync(tsSource, {
    loader: 'ts',
    format: 'cjs',
    target: 'node18',
  });

  const sandbox = {
    module: { exports: {} },
    exports: {},
  };
  sandbox.module.exports = sandbox.exports;
  vm.runInNewContext(compiled.code, sandbox);

  const projects = sandbox.module.exports.PROJECTS;
  if (!Array.isArray(projects) || projects.length === 0) {
    console.error('[Build Tooling Error] Failed to extract PROJECTS array from src/data/projects.ts');
    process.exit(1);
  }
  return projects;
}

function generateManifest() {
  console.log('[Build Tooling] Generating production build manifest...');

  const pkg = fs.existsSync(PACKAGE_PATH) ? JSON.parse(fs.readFileSync(PACKAGE_PATH, 'utf-8')) : {};
  const metadata = fs.existsSync(METADATA_PATH) ? JSON.parse(fs.readFileSync(METADATA_PATH, 'utf-8')) : {};
  const projects = loadVerifiedProjects();

  const verifiedProjects = projects.map((p) => ({
    id: p.id,
    title: p.title,
    category: p.category,
    tagsCount: Array.isArray(p.tags) ? p.tags.length : 0,
    hasGithub: Boolean(p.githubUrl),
    hasLive: Boolean(p.liveUrl),
  }));

  const githubJsonPath = path.join(ROOT_DIR, 'public', 'data', 'github.json');
  const githubData = fs.existsSync(githubJsonPath) ? JSON.parse(fs.readFileSync(githubJsonPath, 'utf-8')) : null;
  const languagesMonitored = githubData?.languageBytes
    ? Object.entries(githubData.languageBytes)
        .sort((a, b) => Number(b[1]) - Number(a[1]))
        .map(([lang]) => lang)
    : [
        'TypeScript',
        'Python',
        'CSS',
        'JavaScript',
        'HTML',
        'C',
        'C++',
        'PLpgSQL',
        'Dockerfile',
      ];

  const manifest = {
    appName: metadata.name || 'Sayam Mukherjee Portfolio',
    version: pkg.version || '1.0.0',
    generatedAt: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production',
    storageBackend: 'firestore',
    projectCount: verifiedProjects.length,
    projects: verifiedProjects,
    systemIntegrity: 'verified',
    languagesMonitored,
  };

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(manifest, null, 2), 'utf-8');

  console.log(`[Build Tooling] Manifest successfully generated with ${verifiedProjects.length} projects -> public/build-manifest.json`);
}

generateManifest();
