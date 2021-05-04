import * as fs from 'fs'
import frontMatter_ = require('front-matter')
import * as front_matter from 'front-matter'
import * as cp from 'child_process'
import * as path from 'path'
import { pipe } from 'fp-ts/function'
import { glob } from 'glob'

const getWorkspaces = (): Record<string, { location: string }> =>
  pipe(
    cp.execSync('yarn workspaces list --json'),
    (_) => _.toString(),
    (_) => _.trim(),
    (_) => _.split('\n'),
    (_) => _.map((s) => JSON.parse(s)),
    (_) => _.reduce((acc, x) => ({ ...acc, [x.name]: x }), {})
  )

const frontMatter = (frontMatter_ as unknown) as (
  str: string
) => front_matter.FrontMatterResult<any>

const SKIP_CHECKOUT_LATEST = process.env['SKIP_CHECKOUT_LATEST'] || false
const SKIP_DEMO = process.env['SKIP_DEMO'] || false

const genDocs = (workspace: string) => {
  console.log(`Generate docs for ${workspace} ...`)
  if (!SKIP_CHECKOUT_LATEST) {
    const tag = cp.execSync(`git describe --match "${workspace}@*" HEAD`)
    cp.execSync(`git checkout ${tag}`)
    cp.execSync('yarn install')
  }
  cp.execSync(`yarn workspace ${workspace} docs`, { stdio: 'inherit' })

  const workspaceLocation = getWorkspaces()[workspace].location

  const version = pipe(
    fs.readFileSync(path.join(workspaceLocation, `package.json`)),
    (_) => _.toString(),
    JSON.parse,
    (_) => _.version
  )
  const unscopedName = workspace.split('/')[1]
  const targetDir = `public/packages/${unscopedName}`
  cp.execSync(`mkdir -p ${targetDir}`)
  pipe(
    { version },
    (_) => JSON.stringify(_, null, 2),
    (_) => fs.writeFileSync(path.join(targetDir, 'version.json'), _)
  )
  cp.execSync(
    `cp -r ${path.join(workspaceLocation, 'docs/modules/*')} ${targetDir}`
  )
  cp.execSync(
    `mv ${path.join(targetDir, 'index.ts.md')} ${path.join(
      targetDir,
      'index.md'
    )}`
  )
  const files = glob.sync(path.join(targetDir, '*.md'))
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
                parent: 'packages',
                permalink: `/packages/${unscopedName}`,
              },
            }
          : {
              ...result,
              attributes: {
                ...result.attributes,
                parent: unscopedName,
                grand_parent: 'packages',
              },
            },
      (result) =>
        fs.writeFileSync(
          file,
          `---\n${JSON.stringify(result.attributes, null, 2)}\n---\n\n${
            result.body
          }`
        )
    )
  })
  cp.execSync(`git checkout main`)
  console.log('done')
}

const genDemo = (workspace: string) => {
  if (!SKIP_CHECKOUT_LATEST) {
    const tag = cp.execSync(`git describe --match "${workspace}@*" HEAD`)
    cp.execSync(`git checkout ${tag}`)
    cp.execSync('yarn install')
  }
  cp.execSync(`yarn workspace ${workspace} build --prefix-paths`)
  const workspaceLocation = getWorkspaces()[workspace].location
  const version = pipe(
    fs.readFileSync(path.join(workspaceLocation, `package.json`)),
    (_) => _.toString(),
    JSON.parse,
    (_) => _.version
  )
  const targetDir = `public/demo`
  cp.execSync(`mkdir -p ${targetDir}`)
  pipe(
    { version },
    (_) => JSON.stringify(_, null, 2),
    (_) => fs.writeFileSync(path.join(targetDir, 'version.json'), _)
  )
  cp.execSync(`cp -r ${path.join(workspaceLocation, 'public/*')} ${targetDir}`)
  cp.execSync(`git checkout main`)
}

const main = () => {
  if (
    !SKIP_CHECKOUT_LATEST &&
    cp.execSync('git status --porcelain', { stdio: 'inherit' }).toString() !==
      ''
  ) {
    console.error('Git working directory not clean')
    process.exit(1)
  }

  cp.execSync('mkdir -p public')
  cp.execSync('rm -rf public/*')
  cp.execSync('mkdir -p public/packages')

  genDocs('@ts-stadium/graph')
  genDocs('@ts-stadium/type-utils')
  genDocs('@ts-stadium/state-machine')

  if (!SKIP_DEMO) {
    genDemo('@ts-stadium/demo')
  }

  cp.execSync('cp -r docs/* -t public')
}

main()
