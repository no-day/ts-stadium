import * as fs from 'fs';
import * as cp from 'child_process';
import { pipe } from 'fp-ts/function';

if (cp.execSync('git status --porcelain').toString() !== '') {
  console.error('Git working directory not clean');
  process.exit(1);
}

fs.rmdirSync('public', { recursive: true });

const genDocs = (workspace: string) => {
  const tag = cp.execSync(`git describe --match "${workspace}@*" HEAD`);
  cp.execSync(`git checkout ${tag}`);
  cp.execSync('yarn install');
  cp.execSync(`yarn workspace ${workspace} docs-ts`);
  const version = pipe(
    fs.readFileSync('package.json'),
    (_) => _.toString(),
    JSON.parse,
    (_) => _.version
  );
  const workspaces = () =>
    pipe(cp.execSync('yarn workspaces info'), (_) => _.toString(), JSON.parse);
  cp.execSync(
    `cp -r ${workspaces[workspace].location}/docs public/docs/${workspace}/${version}`
  );
};

genDocs('@ts-stadium/core');
