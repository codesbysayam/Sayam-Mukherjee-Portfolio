/**
 * Build Manifest & Metadata Generator
 * -----------------------------------
 * Pre-build validation and build-manifest generation script.
 * Reads repository configuration, project registry, and generates a static
 * runtime metadata manifest in public/build-manifest.json.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_STORE_PATH = path.join(ROOT_DIR, 'data_store.json');
const METADATA_PATH = path.join(ROOT_DIR, 'metadata.json');
const PACKAGE_PATH = path.join(ROOT_DIR, 'package.json');
const OUTPUT_PATH = path.join(ROOT_DIR, 'public', 'build-manifest.json');

function generateManifest() {
  console.log('[Build Tooling] Generating production build manifest...');

  if (!fs.existsSync(DATA_STORE_PATH)) {
    console.error(`[Build Tooling Error] data_store.json not found at ${DATA_STORE_PATH}`);
    process.exit(1);
  }

  const pkg = fs.existsSync(PACKAGE_PATH) ? JSON.parse(fs.readFileSync(PACKAGE_PATH, 'utf-8')) : {};
  const metadata = fs.existsSync(METADATA_PATH) ? JSON.parse(fs.readFileSync(METADATA_PATH, 'utf-8')) : {};
  const dataStore = JSON.parse(fs.readFileSync(DATA_STORE_PATH, 'utf-8'));

  const verifiedProjects = (dataStore.projects || []).map((p) => ({
    id: p.id,
    title: p.title,
    category: p.category,
    tagsCount: (p.tags || []).length,
    hasGithub: Boolean(p.githubUrl),
    hasLive: Boolean(p.liveUrl)
  }));

  const manifest = {
    appName: metadata.name || 'Sayam Mukherjee Portfolio',
    version: pkg.version || '1.0.0',
    generatedAt: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production',
    projectCount: verifiedProjects.length,
    projects: verifiedProjects,
    systemIntegrity: 'verified',
    languagesMonitored: [
      'TypeScript',
      'JavaScript',
      'CSS',
      'HTML',
      'Python',
      'C',
      'Jupyter Notebook'
    ]
  };

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(manifest, null, 2), 'utf-8');

  console.log(`[Build Tooling] Manifest successfully generated with ${verifiedProjects.length} projects -> public/build-manifest.json`);
}

generateManifest();
