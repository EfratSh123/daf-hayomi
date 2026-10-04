import { writeFileSync, readFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { generateCycle } from './lib/dafim.mjs';
import { validateEntries } from './lib/validate.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const learningPkg = JSON.parse(
    readFileSync(path.join(root, 'node_modules/@hebcal/learning/package.json'), 'utf8')
);

console.log('Generating Daf Yomi data from @hebcal/learning...');

const { cycle, entries } = generateCycle();
const { valid, errors, warnings } = validateEntries(entries);

for (const warning of warnings) {
    console.warn(`WARNING: ${warning}`);
}

if (!valid) {
    console.error('Validation failed -- dafim.json was NOT written:');
    for (const error of errors) {
        console.error(`  - ${error}`);
    }
    process.exit(1);
}

const output = {
    source: {
        package: learningPkg.name,
        version: learningPkg.version,
        api: "DailyLearning.lookup('dafYomi', hdate, true)",
    },
    cycle,
    entries,
};

const dataDir = path.join(root, 'data');
mkdirSync(dataDir, { recursive: true });
const outPath = path.join(dataDir, 'dafim.json');
writeFileSync(outPath, JSON.stringify(output, null, 2) + '\n', 'utf8');

console.log(`Wrote ${entries.length} entries for cycle ${cycle} to ${path.relative(root, outPath)}`);
console.log(`First: ${entries[0].gregorianDate} -- ${entries[0].display}`);
console.log(`Last:  ${entries[entries.length - 1].gregorianDate} -- ${entries[entries.length - 1].display}`);
