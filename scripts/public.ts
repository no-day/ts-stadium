import * as fs from 'fs';
import frontMatter_ = require('front-matter');
import * as front_matter from 'front-matter';
import * as cp from 'child_process';
import * as path from 'path';
import { pipe } from 'fp-ts/function';
import { glob } from 'glob';

const frontMatter = (frontMatter_ as unknown) as (
  str: string
) => front_matter.FrontMatterResult<any>;

const CHECKOUT_LATEST = false;

const genDocs = (workspace: string) => {
  if (!CHECKOUT_LATEST) {
    const tag = cp.execSync(`git describe --match "${workspace}@*" HEAD`);
    cp.execSync(`git checkout ${tag}`);
    cp.execSync('yarn install');
  }
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
  const unscopedName = workspace.split('/')[1];
  const targetDir = `public/docs/${unscopedName}`;
  cp.execSync(`mkdir -p ${targetDir}`);
  pipe(
    { version },
    (_) => JSON.stringify(_, null, 2),
    (_) => fs.writeFileSync(path.join(targetDir, 'version.json'), _)
  );
  cp.execSync(
    `cp -r ${path.join(workspaceLocation, 'docs/modules/*')} ${targetDir}`
  );
  cp.execSync(
    `mv ${path.join(targetDir, 'index.ts.md')} ${path.join(
      targetDir,
      'index.md'
    )}`
  );
  const files = glob.sync(path.join(targetDir, '*.md'));
  files.forEach((file) => {
    pipe(
      fs.readFileSync(file),
      (_) => _.toString(),
      (str) => frontMatter(str),
      (result) =>
        path.parse(file).base === 'index.md'
          ? {
              ...result,
              attributes: {
                ...result.attributes,
                title: unscopedName,
                parent: undefined,
                permalink: `/docs/${unscopedName}`,
              },
            }
          : {
              ...result,
              attributes: {
                ...result.attributes,
                parent: unscopedName,
              },
            },
      (result) =>
        fs.writeFileSync(
          file,
          `---\n${JSON.stringify(result.attributes, null, 2)}\n---\n\n${
            result.body
          }`
        )
    );
  });
  cp.execSync(`git checkout main`);
};

const genDemo = (workspace: string) => {
  if (!CHECKOUT_LATEST) {
    const tag = cp.execSync(`git describe --match "${workspace}@*" HEAD`);
    cp.execSync(`git checkout ${tag}`);
    cp.execSync('yarn install');
  }
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
  cp.execSync(`mkdir -p ${targetDir}`);
  pipe(
    { version },
    (_) => JSON.stringify(_, null, 2),
    (_) => fs.writeFileSync(path.join(targetDir, 'version.json'), _)
  );
  cp.execSync(`cp -r ${path.join(workspaceLocation, 'public/*')} ${targetDir}`);
  cp.execSync(`git checkout main`);
};

const main = () => {
  if (
    CHECKOUT_LATEST &&
    cp.execSync('git status --porcelain').toString() !== ''
  ) {
    console.error('Git working directory not clean');
    process.exit(1);
  }

  fs.rmdirSync('public', { recursive: true });
  cp.execSync('mkdir -p public/docs');

  genDocs('@ts-stadium/core');
  genDocs('@ts-stadium/graph');

  genDemo('@ts-stadium/demo');

  cp.execSync('cp -r docs/* -t public');
};

main();
