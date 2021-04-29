import * as fs from 'fs';
import * as cp from 'child_process';
import * as path from 'path';
import { pipe } from 'fp-ts/function';

if (cp.execSync('git status --porcelain').toString() !== '') {
  console.error('Git working directory not clean');
  process.exit(1);
}

fs.rmdirSync('public', { recursive: true });

cp.execSync('mkdir -p public/docs');

const genDocs = (workspace: string) => {
  const tag = cp.execSync(`git describe --match "${workspace}@*" HEAD`);
  cp.execSync(`git checkout ${tag}`);
  cp.execSync('yarn install');
  cp.execSync(`yarn workspace ${workspace} docs-ts`);
  const workspaces = pipe(
    cp.execSync('yarn workspaces info'),
    (_) => _.toString(),
    JSON.parse
  );
  const workspaceLocation = workspaces[workspace].location;
  const version = pipe(
    fs.readFileSync(path.join(workspaceLocation, `package.json`)),
    (_) => _.toString(),
    JSON.parse,
    (_) => _.version
  );
  const targetDir = `public/docs/${workspace}/latest`;
  pipe(
    { version },
    (_) => JSON.stringify(_, null, 2),
    (_) => fs.writeFileSync(path.join(targetDir, 'version.json'), _)
  );
  cp.execSync(`mkdir -p ${targetDir}`);
  cp.execSync(`cp -r ${path.join(workspaceLocation, 'docs/*')} ${targetDir}`);
  cp.execSync(`git checkout main`);
};

const genDemo = (workspace: string) => {
  const tag = cp.execSync(`git describe --match "${workspace}@*" HEAD`);
  cp.execSync(`git checkout ${tag}`);
  cp.execSync('yarn install');
  cp.execSync(`yarn workspace ${workspace} build`);
  const workspaces = pipe(
    cp.execSync('yarn workspaces info'),
    (_) => _.toString(),
    JSON.parse
  );
  const workspaceLocation = workspaces[workspace].location;
  const version = pipe(
    fs.readFileSync(path.join(workspaceLocation, `package.json`)),
    (_) => _.toString(),
    JSON.parse,
    (_) => _.version
  );
  const targetDir = `public/demo/latest`;
  pipe(
    { version },
    (_) => JSON.stringify(_, null, 2),
    (_) => fs.writeFileSync(path.join(targetDir, 'version.json'), _)
  );
  cp.execSync(`mkdir -p ${targetDir}`);
  cp.execSync(`cp -r ${path.join(workspaceLocation, 'public/*')} ${targetDir}`);
  cp.execSync(`git checkout main`);
};

genDocs('@ts-stadium/core');
genDemo('@ts-stadium/demo');
