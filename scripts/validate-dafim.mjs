import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { validateEntries } from './lib/validate.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const dataPath = path.join(root, 'data/dafim.json');

const data = JSON.parse(readFileSync(dataPath, 'utf8'));

console.log(
    `Validating ${path.relative(root, dataPath)} (cycle ${data.cycle}, ${data.entries.length} entries)...`
);

const { valid, errors, warnings } = validateEntries(data.entries);

for (const warning of warnings) {
    console.warn(`WARNING: ${warning}`);
}

if (!valid) {
    console.error('FAILED:');
    for (const error of errors) {
        console.error(`  - ${error}`);
    }
    process.exit(1);
}

console.log('PASS: all invariants hold.');
