import { execSync } from 'child_process';
import { testCollections } from './tests/Collections/test-collection.config.js';

const args = process.argv.slice(2);
const collection = args[0];

if (!collection || !testCollections[collection]) {
  throw new Error(`❌ Unknown or missing collection: ${collection}`);
}

// Flags
const isHeaded = args.includes('headed');
const isSerial = args.includes('serial');

// ENV
const env = process.env.ENV || 'qa';

// Resolve spec paths
const paths = testCollections[collection].join(' ');

// Build Playwright command dynamically
let command = `ENV=${env} npx playwright test ${paths}`;

if (isHeaded) {
  command += ' --headed';
}

if (isSerial) {
  command += ' --workers=1';
}

console.log('🚀 Running command:\n', command, '\n');

execSync(command, { stdio: 'inherit' });
