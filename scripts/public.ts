import * as fs from 'fs';
import * as cp from 'child_process';

if (cp.execSync('git status --porcelain').toString() !== '') {
  console.error('Git working directory not clean');
  process.exit(1);
}

fs.rmdirSync('public', { recursive: true });

const tag = cp.execSync('git describe --match "@ts-stadium/core@*" HEAD');

//cp.execSync(`git checkou ${tag}`);

//const tag = cp.spawn('git describe --match "@ts-stadium/core@*" HEAD');

console.log(tag.toString());
