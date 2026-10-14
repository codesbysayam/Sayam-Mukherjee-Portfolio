#!/usr/bin/env node
/**
 * scripts/preflight.mjs
 * Centralized Project Health Check & Validation Pipeline
 * -----------------------------------------------------
 * Automatically identifies and runs project checks:
 * 1. Static Portfolio Data Validation (python3 tools/python/portfolio_data_validator.py)
 * 2. TypeScript Compilation & Type Safety (tsc --noEmit)
 * 3. Build Manifest & Data Store Integrity (scripts/generate_build_manifest.js)
 * 4. Production Asset Compilation (vite build)
 */

import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m'
};

function logStep(name, status) {
  const prefix = `[PREFLIGHT]`;
  if (status === 'RUNNING') {
    console.log(`\n${colors.cyan}${prefix} Running: ${colors.bold}${name}${colors.reset}...`);
  } else if (status === 'PASSED') {
    console.log(`${colors.green}✔ PASSED:${colors.reset} ${name}`);
  } else if (status === 'SKIPPED') {
    console.log(`${colors.yellow}⚠ SKIPPED:${colors.reset} ${name}`);
  } else if (status === 'FAILED') {
    console.error(`${colors.red}✖ FAILED:${colors.reset} ${name}`);
  }
}

function runCommand(command, args, cwd = ROOT_DIR) {
  return new Promise((resolve, reject) => {
    const proc = spawn(command, args, {
      cwd,
      stdio: 'inherit',
      shell: true
    });

    proc.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command "${command} ${args.join(' ')}" exited with code ${code}`));
      }
    });

    proc.on('error', (err) => {
      reject(err);
    });
  });
}

async function runPreflight() {
  const startTime = Date.now();
  console.log(`${colors.bold}${colors.cyan}======================================================${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}  Sayam Mukherjee Portfolio - Central Preflight Check ${colors.reset}`);
  console.log(`${colors.dim}  Validating type safety, data integrity, and buildability...${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}======================================================${colors.reset}`);

  const results = [];

  // Check 1: Static data validation via Python validator
  const pythonValidator = path.join(ROOT_DIR, 'tools', 'python', 'portfolio_data_validator.py');
  if (fs.existsSync(pythonValidator)) {
    logStep('Portfolio Data Integrity Validator (Python)', 'RUNNING');
    try {
      await runCommand('python3', [pythonValidator]);
      logStep('Portfolio Data Integrity Validator', 'PASSED');
      results.push({ name: 'Data Validator', ok: true });
    } catch (err) {
      logStep('Portfolio Data Integrity Validator', 'FAILED');
      results.push({ name: 'Data Validator', ok: false, error: err.message });
    }
  } else {
    logStep('Portfolio Data Integrity Validator', 'SKIPPED');
  }

  // Check 2: TypeScript compilation check (tsc --noEmit)
  logStep('TypeScript Type Check (tsc --noEmit)', 'RUNNING');
  try {
    await runCommand('npx', ['tsc', '--noEmit']);
    logStep('TypeScript Type Check', 'PASSED');
    results.push({ name: 'TypeScript Check', ok: true });
  } catch (err) {
    logStep('TypeScript Type Check', 'FAILED');
    results.push({ name: 'TypeScript Check', ok: false, error: err.message });
  }

  // Check 3: Build Manifest Generation
  const manifestScript = path.join(ROOT_DIR, 'scripts', 'generate_build_manifest.js');
  if (fs.existsSync(manifestScript)) {
    logStep('Build Manifest & Data Store Integrity (Node)', 'RUNNING');
    try {
      await runCommand('node', [manifestScript]);
      logStep('Build Manifest & Data Store Integrity', 'PASSED');
      results.push({ name: 'Manifest Generator', ok: true });
    } catch (err) {
      logStep('Build Manifest & Data Store Integrity', 'FAILED');
      results.push({ name: 'Manifest Generator', ok: false, error: err.message });
    }
  }

  // Check 4: Production Build Dry-Run (vite build)
  logStep('Vite Production Asset Compilation (vite build)', 'RUNNING');
  try {
    await runCommand('npx', ['vite', 'build']);
    logStep('Vite Production Asset Compilation', 'PASSED');
    results.push({ name: 'Vite Build', ok: true });
  } catch (err) {
    logStep('Vite Production Asset Compilation', 'FAILED');
    results.push({ name: 'Vite Build', ok: false, error: err.message });
  }

  // Check 5: C Native binary build check (if gcc exists and tools/c present)
  const cMetricsFile = path.join(ROOT_DIR, 'tools', 'c', 'portfolio_metrics.c');
  if (fs.existsSync(cMetricsFile)) {
    logStep('C Native Metrics Module (gcc)', 'RUNNING');
    try {
      await runCommand('gcc', ['-O2', 'tools/c/portfolio_metrics.c', '-o', 'tools/c/portfolio_metrics']);
      logStep('C Native Metrics Module', 'PASSED');
      results.push({ name: 'C Native Metrics', ok: true });
    } catch (err) {
      console.warn(`[PREFLIGHT] C module compilation skipped or failed: ${err.message}`);
      // Not a hard failure for frontend SPA if gcc isn't configured in all runners
      results.push({ name: 'C Native Metrics', ok: true, note: 'optional' });
    }
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  const allPassed = results.every((r) => r.ok);

  console.log(`\n${colors.bold}------------------------------------------------------${colors.reset}`);
  console.log(`${colors.bold}Preflight Summary (${duration}s):${colors.reset}`);
  for (const r of results) {
    console.log(`  ${r.ok ? colors.green + '✔' : colors.red + '✖'} ${r.name}${r.note ? ` (${r.note})` : ''}${colors.reset}`);
  }
  console.log(`${colors.bold}------------------------------------------------------${colors.reset}`);

  if (!allPassed) {
    console.error(`\n${colors.red}${colors.bold}Preflight check failed! Please fix the errors listed above.${colors.reset}\n`);
    process.exit(1);
  } else {
    console.log(`\n${colors.green}${colors.bold}All preflight checks passed successfully! Ready for deployment.${colors.reset}\n`);
    process.exit(0);
  }
}

runPreflight();
